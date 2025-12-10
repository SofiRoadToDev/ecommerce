import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createPayPalOrder } from '@/lib/paypal/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/types/database'

// Validation schema for request body
const createOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      quantity: z.number().int().min(1),
    })
  ).min(1, 'Cart must have at least one item'),
  customer: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
    country: z.string().min(2, 'Country must be at least 2 characters'),
  }),
})

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json()
    const validation = createOrderSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { items, customer } = validation.data

    // 2. Fetch actual product data from Supabase (NEVER trust client prices)
    const supabase = createAdminClient()
    const productIds = items.map(item => item.id)

    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, title, price, stock')
      .in('id', productIds)
      .returns<Array<{ id: string; title: string; price: number; stock: number }>>()

    if (fetchError || !products) {
      console.error('Error fetching products:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch product data' },
        { status: 500 }
      )
    }

    // 3. Validate stock availability and calculate total
    let total = 0
    const orderItems = []

    for (const cartItem of items) {
      const product = products.find(p => p.id === cartItem.id)

      if (!product) {
        return NextResponse.json(
          { error: `Product ${cartItem.id} not found` },
          { status: 404 }
        )
      }

      // Check stock availability
      if (product.stock < cartItem.quantity) {
        return NextResponse.json(
          {
            error: 'Insufficient stock',
            product: product.title,
            available: product.stock,
            requested: cartItem.quantity
          },
          { status: 400 }
        )
      }

      // Calculate with server-side prices only
      const subtotal = product.price * cartItem.quantity
      total += subtotal

      orderItems.push({
        id: product.id,
        title: product.title,
        quantity: cartItem.quantity,
        price: product.price,
      })
    }

    // 4. Create PayPal Order
    const order = await createPayPalOrder(total, 'USD')

    // Store order items and customer data in temporary table for webhook processing
    const pendingOrder: Database['public']['Tables']['pending_orders']['Insert'] = {
      paypal_order_id: order.id,
      order_items: orderItems,
      total_amount: total,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_address: customer,
    }

    // Workaround: Supabase types not recognizing pending_orders after upgrade (see bugs_to_fix.md)
    const { error: storeError } = await (supabase
      .from('pending_orders') as any)
      .insert(pendingOrder)

    if (storeError) {
      console.error('CRITICAL: Failed to store pending order:', storeError)
      console.error('PayPal Order ID:', order.id)
      console.error('Pending order data:', pendingOrder)
      return NextResponse.json(
        { error: 'Failed to store order data. Please try again.' },
        { status: 500 }
      )
    }

    console.log('✅ Pending order stored successfully:', order.id)

    // 5. Return order ID to client
    return NextResponse.json({
      orderId: order.id,
      amount: total,
    })

  } catch (error) {
    console.error('Error creating PayPal order:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
