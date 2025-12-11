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

    // Create order directly in database with 'pending' status
    // Store PayPal Order ID in payment_intent_id for later retrieval via webhook
    const newOrder = {
      customer_email: customer.email,
      customer_name: customer.name,
      shipping_address: customer,
      total_amount: total,
      status: 'pending',
      payment_intent_id: order.id,
    }

    const { data: createdOrder, error: paramsError } = await supabase
      .from('orders')
      .insert(newOrder)
      .select()
      .single()

    if (paramsError || !createdOrder) {
      console.error('Failed to create order:', paramsError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Create order items
    const orderItemsData = orderItems.map(item => ({
      order_id: createdOrder.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData)

    if (itemsError) {
      console.error('Failed to create order items:', itemsError)
      // Rollback order creation if items fail (optional but recommended)
      await supabase.from('orders').delete().eq('id', createdOrder.id)

      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      )
    }

    console.log('✅ Order created successfully:', createdOrder.id, 'PayPal ID:', order.id)

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
