'use client'

import { useState } from 'react'
import { OrderWithDetails, OrderStatus } from '@/types/models'
import { Search, Package, ChevronDown } from 'lucide-react'

interface OrderTableProps {
  orders: OrderWithDetails[]
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => Promise<void>
  onViewDetails: (order: OrderWithDetails) => void
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-gray-50 text-gray-700 border-gray-200'
  },
  paid: {
    label: 'Paid',
    className: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  processing: {
    label: 'Processing',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-green-50 text-green-700 border-green-200'
  },
  ready_for_pickup: {
    label: 'Ready for Pickup',
    className: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-50 text-red-700 border-red-200'
  }
}

export function OrderTable({ orders, onStatusUpdate, onViewDetails }: OrderTableProps) {
  const [searchEmail, setSearchEmail] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  const filteredOrders = orders.filter(order => {
    const matchesEmail = !searchEmail || order.customer_email.toLowerCase().includes(searchEmail.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesEmail && matchesStatus
  })

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId)
    try {
      await onStatusUpdate(orderId, newStatus)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const shortId = (id: string) => id.slice(0, 8)

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="ready_for_pickup">Ready for Pickup</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {searchEmail || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Orders will appear here once customers make purchases'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const config = statusConfig[order.status]
                  const isUpdating = updatingOrderId === order.id

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900">
                          {shortId(order.id)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {formatDate(order.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.customer_name}</div>
                        <div className="text-sm text-gray-500">{order.customer_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(order.total_amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => onViewDetails(order)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          View Details
                        </button>
                        <span className="text-gray-300">|</span>
                        <div className="inline-block relative">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            disabled={isUpdating}
                            className="appearance-none bg-transparent text-gray-600 hover:text-gray-900 font-medium pr-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <option value={order.status} disabled>
                              {isUpdating ? 'Updating...' : 'Update Status'}
                            </option>
                            {Object.entries(statusConfig)
                              .filter(([status]) => status !== order.status)
                              .map(([status, config]) => (
                                <option key={status} value={status}>
                                  {config.label}
                                </option>
                              ))}
                          </select>
                          <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results count */}
      {filteredOrders.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
          {(searchEmail || statusFilter !== 'all') && ` (filtered from ${orders.length} total)`}
        </div>
      )}
    </div>
  )
}
