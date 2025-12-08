'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { OrderWithDetails, OrderStatus } from '@/types/models'
import { OrderTable } from '@/components/admin/OrderTable'
import { createAdminClient } from '@/lib/supabase/admin'
import { Package } from 'lucide-react'

// Lazy load OrderDetailsModal (only loads when modal is opened)
const OrderDetailsModal = dynamic(() => import('@/components/admin/OrderDetailsModal').then(mod => ({ default: mod.OrderDetailsModal })), {
  ssr: false,
  loading: () => null
})

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

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

      if (ordersError) throw ordersError

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

      setOrders(transformedOrders)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error?.message || 'Failed to update order status')
      }

      // Refresh orders to get updated data
      await fetchOrders()
    } catch (err) {
      console.error('Error updating order status:', err)
      alert(err instanceof Error ? err.message : 'Failed to update order status')
    }
  }

  const handleViewDetails = (order: OrderWithDetails) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        </div>
        <div className="text-sm text-gray-600">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
        </div>
      </div>

      {/* Orders Table */}
      <OrderTable
        orders={orders}
        onStatusUpdate={handleStatusUpdate}
        onViewDetails={handleViewDetails}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
      />
    </div>
  )
}
