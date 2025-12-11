'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Menu,
  X,
  Tags,
  Palette
} from 'lucide-react'
import { t } from '@/lib/i18n'
import AdminLogout from '@/components/admin-logout'

interface AdminNavigationProps {
  children: React.ReactNode
}

export default function AdminNavigation({ children }: AdminNavigationProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    {
      name: t('admin.dashboard'),
      href: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      name: t('admin.products'),
      href: '/admin/products',
      icon: Package
    },
    {
      name: t('admin.categories'),
      href: '/admin/categories',
      icon: Tags
    },
    {
      name: t('admin.orders'),
      href: '/admin/orders',
      icon: ShoppingCart
    },
    {
      name: t('admin.branding'),
      href: '/admin/branding',
      icon: Palette
    },
  ]

  return (
    <div className="flex h-full w-full" suppressHydrationWarning>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 text-slate-300
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">
              {t('admin.title')}
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${isActive
                      ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-lg shadow-primary-500/5'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-white'}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <AdminLogout />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/50">
        {/* Top bar (mobile) */}
        <header className="lg:hidden glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">
            {t('admin.title')}
          </h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}