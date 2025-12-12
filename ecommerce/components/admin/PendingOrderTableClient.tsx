'use client'

import { useState, useEffect } from 'react'
import { PendingOrder } from '@/types/models'
import { Search, Package, Clock } from 'lucide-react'
import { Pagination } from '@/components/ui/Pagination'

interface PendingOrderTableClientProps {
    orders: PendingOrder[]
}

export function PendingOrderTableClient({ orders }: PendingOrderTableClientProps) {
    const [searchEmail, setSearchEmail] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const filteredOrders = orders.filter(order => {
        if (!searchEmail) return true
        const email = order.customer_email?.toLowerCase() || ''
        const name = order.customer_name?.toLowerCase() || ''
        const search = searchEmail.toLowerCase()
        return email.includes(search) || name.includes(search)
    })

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchEmail])

    // Calculate pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
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
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by customer email or name..."
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                    />
                </div>
            </div>

            {/* Table */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center dark:bg-slate-900 dark:border-slate-700">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No pending orders</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {searchEmail
                            ? 'Try adjusting your search'
                            : 'All orders have been confirmed or there are no pending payments'}
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        PayPal Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {paginatedOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-mono text-gray-900 dark:text-gray-300">
                                                {shortId(order.id)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                                                {order.paypal_order_id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900 dark:text-gray-300">
                                                {formatDate(order.created_at)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-gray-200">
                                                {order.customer_name || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {order.customer_email || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-gray-300">
                                                {order.order_items.length} {order.order_items.length === 1 ? 'item' : 'items'}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {order.order_items.slice(0, 2).map((item, idx) => (
                                                    <div key={idx}>{item.title} ×{item.quantity}</div>
                                                ))}
                                                {order.order_items.length > 2 && (
                                                    <div className="italic">+{order.order_items.length - 2} more</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {formatPrice(order.total_amount)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {filteredOrders.length > 0 && (
                <>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />

                    <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
                        {searchEmail && ` (filtered from ${orders.length} total)`}
                    </div>
                </>
            )}
        </div>
    )
}
