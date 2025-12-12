import { NextRequest, NextResponse } from 'next/server'
import { capturePayPalOrder } from '@/lib/paypal/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { orderID } = body // PayPal uses orderID in client, create-paypal-order uses orderId. Client sends whatever we define.

        if (!orderID) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            )
        }

        // 1. Capture the payment with PayPal
        console.log('⚡ Capturing PayPal order:', orderID)
        const captureData = await capturePayPalOrder(orderID)

        if (captureData.status !== 'COMPLETED') {
            return NextResponse.json(
                { error: 'Payment not completed', details: captureData },
                { status: 400 }
            )
        }

        // 2. Update Order in Supabase
        const supabase = createAdminClient()

        // Find the order
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select(`
        *,
        order_items (
          *,
          products (title)
        )
      `)
            .eq('payment_intent_id', orderID)
            .single()

        if (fetchError || !order) {
            console.error('Order not found for PayPal ID:', orderID)
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        if (order.status === 'paid') {
            return NextResponse.json({ success: true, orderId: order.id, message: 'Already paid' })
        }

        // Update status
        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: 'paid' })
            .eq('id', order.id)

        if (updateError) {
            console.error('Failed to update order status:', updateError)
            return NextResponse.json(
                { error: 'Failed to update order status' },
                { status: 500 }
            )
        }

        // 3. Update Stock
        console.log('📦 Updating stock...')
        const orderItems = order.order_items
        if (Array.isArray(orderItems)) {
            for (const item of orderItems) {
                const { error: stockError } = await (supabase as any).rpc('decrement_stock', {
                    p_product_id: item.product_id,
                    p_quantity: item.quantity,
                })
                if (stockError) console.error(`Failed to update stock for ${item.product_id}`, stockError)
            }
        }

        // 4. Send Email (Async, don't block response)
        // We import dynamically to avoid issues if email service has deps
        try {
            const { sendOrderConfirmationEmail } = await import('@/lib/email/send')

            const { data: branding } = await (supabase
                .from('branding') as any)
                .select('brand_name, logo_url, primary_color, contact_email, contact_phone, contact_address')
                .limit(1)
                .single()

            const emailData = {
                orderId: order.id,
                customerName: order.customer_name,
                customerEmail: order.customer_email,
                totalAmount: Number(order.total_amount),
                status: 'paid',
                items: Array.isArray(orderItems) ? orderItems.map((item: any) => ({
                    title: item.products?.title || 'Product',
                    quantity: item.quantity,
                    price: item.price_at_purchase
                })) : [],
                brandName: branding?.brand_name || 'Sofia Store',
                logoUrl: branding?.logo_url || undefined,
                primaryColor: branding?.primary_color || undefined,
                contactEmail: branding?.contact_email || undefined,
                contactPhone: branding?.contact_phone || undefined,
                contactAddress: branding?.contact_address || undefined
            }

            await sendOrderConfirmationEmail(emailData)
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError)
        }

        return NextResponse.json({ success: true, orderId: order.id })

    } catch (error) {
        console.error('Capture API Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
