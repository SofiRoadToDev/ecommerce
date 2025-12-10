
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { OrdersClient } from '@/components/admin/OrdersClient'
import { OrderWithDetails } from '@/types/models'

export const dynamic = 'force-dynamic'

async function getOrders(): Promise<OrderWithDetails[]> {
  const supabase = createAdminClient()

  // Fetch orders with order items and product details
  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        order_id,
        product_id,
        quantity,
        price_at_purchase,
        product:products (
          id,
          title,
          image_url
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (ordersError) {
    console.error('Error fetching orders:', ordersError)
    return []
  }

  // Transform data to match OrderWithDetails type
  const transformedOrders: OrderWithDetails[] = (ordersData || []).map((order: any) => ({
    id: order.id,
    created_at: order.created_at,
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    shipping_address: {
      address: order.customer_address || '',
      city: order.customer_city || '',
      postal_code: order.customer_postal_code || '',
      country: order.customer_country || '',
    },
    total_amount: order.total_amount,
    status: order.status,
    payment_intent_id: order.payment_id || null,
    items: order.order_items.map((item: any) => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
      product: item.product
    }))
  }))

  return transformedOrders
}

export default async function OrdersPage() {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    redirect('/admin/login')
  }

  const orders = await getOrders()

  return <OrdersClient initialOrders={orders} />
}
