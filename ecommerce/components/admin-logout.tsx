'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { t } from '@/lib/i18n'

export default function AdminLogout() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Cierra sesión en Supabase y vuelve al login
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/admin/login')
      router.refresh()
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
