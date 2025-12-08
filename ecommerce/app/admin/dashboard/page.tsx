import { getUser } from '@/lib/supabase/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { t } from '@/lib/i18n'
import { Package, ShoppingCart, DollarSign, AlertCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { Order } from '@/types/models'
import AdminUserInfo from '@/components/admin-user-info'

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

  if (!orders) return []

  return orders.map(order => ({
    ...order,
    created_at: order.created_at || new Date().toISOString()
  })) as RecentOrder[]
}

export default async function AdminDashboardPage() {
  const user = await getUser()
  const stats = await getDashboardStats()
  const recentOrders = await getRecentOrders()

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400 mb-2 animate-pulse">
          {t('admin.welcomeBack')}
        </h1>
        <AdminUserInfo />
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Sales */}
        <div className="glass-card group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
              <DollarSign className="w-8 h-8 text-emerald-400" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              +12.5%
            </span>
          </div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">
            {t('admin.totalSales')}
          </h3>
          <p className="text-3xl font-bold text-slate-100">
            ${stats.totalSales.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            All time revenue
          </p>
        </div>

        {/* Pending Orders */}
        <div className="glass-card group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
              <ShoppingCart className="w-8 h-8 text-blue-400" />
            </div>
            {stats.pendingOrders > 0 && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            )}
          </div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">
            {t('admin.pendingOrders')}
          </h3>
          <p className="text-3xl font-bold text-slate-100">
            {stats.pendingOrders}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Orders needing attention
          </p>
        </div>

        {/* Total Products */}
        <div className="glass-card group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-violet-500/10 rounded-xl group-hover:bg-violet-500/20 transition-colors">
              <Package className="w-8 h-8 text-violet-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">
            {t('admin.totalProducts')}
          </h3>
          <p className="text-3xl font-bold text-slate-100">
            {stats.totalProducts}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Active inventory items
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-card group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl group-hover:bg-amber-500/20 transition-colors">
              <AlertCircle className="w-8 h-8 text-amber-400" />
            </div>
            {stats.lowStockCount > 0 && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Action needed
              </span>
            )}
          </div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">
            {t('admin.lowStockAlerts')}
          </h3>
          <p className="text-3xl font-bold text-slate-100">
            {stats.lowStockCount}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Products with stock {'<'} 5
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Clock className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-100">
              Recent Orders
            </h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors border border-primary-500/20 px-3 py-1.5 rounded-lg hover:bg-primary-500/10"
          >
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-slate-800/50 mb-4 animate-float">
              <ShoppingCart className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400">No active orders found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentOrders.map((order) => {
              const statusConfig: Record<typeof order.status, { label: string; className: string }> = {
                pending: { label: 'Pending', className: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
                paid: { label: 'Paid', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                processing: { label: 'Processing', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                shipped: { label: 'Shipped', className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
                ready_for_pickup: { label: 'Ready', className: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                completed: { label: 'Completed', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                cancelled: { label: 'Cancelled', className: 'bg-red-500/10 text-red-400 border-red-500/20' }
              }

              const config = statusConfig[order.status]

              return (
                <div key={order.id} className="p-6 hover:bg-white/5 transition-colors group">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-slate-500 group-hover:text-primary-400 transition-colors">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-200">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.customer_email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-100">
                        ${order.total_amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
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
