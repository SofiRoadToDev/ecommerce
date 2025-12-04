import { getUser } from '@/lib/supabase/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { t } from '@/lib/i18n'
import { Package, ShoppingCart, DollarSign, AlertCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { Order } from '@/types/models'

interface DashboardStats {
  totalSales: number
  pendingOrders: number
  totalProducts: number
  lowStockCount: number
}

interface RecentOrder {
  id: string
  created_at: string
  customer_name: string
  customer_email: string
  total_amount: number
  status: Order['status']
}

async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createAdminClient()

  // Get total sales (sum of all paid orders)
  // Workaround: Supabase types issue (see bugs_to_fix.md)
  const { data: salesData } = await (supabase
    .from('orders') as any)
    .select('total_amount')
    .in('status', ['paid', 'processing', 'shipped', 'delivered'])

  const totalSales = salesData?.reduce((sum: number, order: any) => sum + order.total_amount, 0) || 0

  // Get pending orders count (paid + processing)
  const { count: pendingCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['paid', 'processing'])

  // Get total products count
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  // Get low stock alerts (stock < 5)
  const { count: lowStockCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .lt('stock', 5)

  return {
    totalSales,
    pendingOrders: pendingCount || 0,
    totalProducts: productsCount || 0,
    lowStockCount: lowStockCount || 0,
  }
}

async function getRecentOrders(): Promise<RecentOrder[]> {
  const supabase = createAdminClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('id, created_at, customer_name, customer_email, total_amount, status')
    .order('created_at', { ascending: false })
    .limit(5)

  return orders || []
}

export default async function AdminDashboardPage() {
  const user = await getUser()
  const stats = await getDashboardStats()
  const recentOrders = await getRecentOrders()

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('admin.welcomeBack')}
        </h1>
        <p className="text-gray-600">
          {user?.email}
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Sales */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            {t('admin.totalSales')}
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            ${stats.totalSales.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            All time
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            {t('admin.pendingOrders')}
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats.pendingOrders}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Needs attention
          </p>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            {t('admin.totalProducts')}
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalProducts}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            In inventory
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            {t('admin.lowStockAlerts')}
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats.lowStockCount}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Stock {'<'} 5 units
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-gray-900" />
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Orders
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              View all
            </Link>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order) => {
              const statusConfig: Record<typeof order.status, { label: string; className: string }> = {
                pending: { label: 'Pending', className: 'bg-gray-50 text-gray-700 border-gray-200' },
                paid: { label: 'Paid', className: 'bg-blue-50 text-blue-700 border-blue-200' },
                processing: { label: 'Processing', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
                shipped: { label: 'Shipped', className: 'bg-green-50 text-green-700 border-green-200' },
                ready_for_pickup: { label: 'Ready for Pickup', className: 'bg-purple-50 text-purple-700 border-purple-200' },
                completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-700 border-red-200' }
              }

              const config = statusConfig[order.status]

              return (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-mono text-gray-900">
                          {order.id.slice(0, 8)}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium truncate">
                        {order.customer_name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {order.customer_email}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-gray-900">
                        ${order.total_amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
