'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { t } from '@/lib/i18n'

export default function AdminLogout() {
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/admin/login' })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
    >
      <LogOut className="w-4 h-4" />
      {t('admin.logout')}
    </Button>
  )
}