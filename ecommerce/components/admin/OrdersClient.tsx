'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { OrderWithDetails, OrderStatus } from '@/types/models'
import { OrderTable } from '@/components/admin/OrderTable'
import { Package } from 'lucide-react'

// Lazy load OrderDetailsModal
const OrderDetailsModal = dynamic(() => import('@/components/admin/OrderDetailsModal').then(mod => ({ default: mod.OrderDetailsModal })), {
    ssr: false,
    loading: () => null
})

interface OrdersClientProps {
    initialOrders: OrderWithDetails[]
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
    const [orders, setOrders] = useState<OrderWithDetails[]>(initialOrders)
    const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

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

            // Optimistically update local state
            setOrders(prev => prev.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ))

            // Optional: re-fetch from server to be 100% sure, but optimistic is faster
            // You could pass a refresh method or use router.refresh() if moving fully to server components
        } catch (err) {
            console.error('Error updating order status:', err)
            alert(err instanceof Error ? err.message : 'Failed to update order status')
        }
    }

    const handleViewDetails = (order: OrderWithDetails) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Package className="w-8 h-8 text-gray-900 dark:text-white" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
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
