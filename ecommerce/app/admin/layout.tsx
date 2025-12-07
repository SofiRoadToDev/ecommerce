import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import AdminNavigation from './components/AdminNavigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Obtener la sesión con NextAuth
  const session = await getServerSession(authOptions)
  
  if (!session) {
    // For login page, don't show the navigation
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  // Verificar si el usuario tiene rol admin
  const role = session.user.role
  
  if (role !== 'admin') {
    redirect('/admin/login')
  }

  return (
    <div className="flex h-screen bg-gray-100" suppressHydrationWarning>
      <AdminNavigation>
        {children}
      </AdminNavigation>
    </div>
  )
}