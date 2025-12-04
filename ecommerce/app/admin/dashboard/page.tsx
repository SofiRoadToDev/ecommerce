import { getUser } from '@/lib/supabase/auth'
import { t } from '@/lib/i18n'
import { Package, ShoppingCart, DollarSign, AlertCircle } from 'lucide-react'

export default async function AdminDashboardPage() {
  const user = await getUser()

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
            $0.00
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {t('admin.comingSoon')}
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
            0
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {t('admin.comingSoon')}
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
            0
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {t('admin.comingSoon')}
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
            0
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {t('admin.comingSoon')}
          </p>
        </div>
      </div>

      {/* Placeholder for future sections */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t('admin.dashboardPlaceholder')}
          </h2>
          <p className="text-gray-600">
            {t('admin.dashboardDescription')}
          </p>
        </div>
      </div>
    </div>
  )
}
