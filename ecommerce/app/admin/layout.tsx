import { redirect } from 'next/navigation'
import AdminNavigation from './components/AdminNavigation'
import { getUser } from '@/lib/supabase/auth'

// Layout de admin: valida sesión y rol usando Supabase
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Obtiene usuario desde Supabase (SSR)
  const user = await getUser()

  if (!user) {
    // For login page, don't show the navigation
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  // Verificar rol admin desde metadata
  const role = (user.user_metadata as any)?.role || (user.app_metadata as any)?.role

  if (role !== 'admin') {
    redirect('/admin/login')
  }

  return (
    <div className="flex h-screen bg-slate-950/50" suppressHydrationWarning>
      <AdminNavigation>
        {children}
      </AdminNavigation>
    </div>
  )
}
