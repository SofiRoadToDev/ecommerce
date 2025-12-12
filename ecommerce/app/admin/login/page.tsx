'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { t } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

// Login de admin usando Supabase Auth
export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Autentica con email/password en Supabase
      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error('❌ Error de Supabase Auth:', JSON.stringify(signInError, null, 2))
        setError(signInError.message)
        setLoading(false)
        return
      }

      // Verifica rol admin en metadata
      const user = data.user
      const role = user?.user_metadata?.role || user?.app_metadata?.role

      if (role !== 'admin') {
        console.warn('⚠️ Usuario autenticado pero sin rol de admin:', user?.id)
        await supabase.auth.signOut()
        setError('No autorizado - se requiere rol de administrador')
        setLoading(false)
        return
      }

      // Redirige al dashboard
      router.push('/admin/dashboard')
      router.refresh()
    } catch (err) {
      console.error('💥 Error crítico en login:', err)
      if (typeof err === 'object' && err !== null) {
        console.error('Detalles del error:', JSON.stringify(err, null, 2))
      }

      let errorMessage = t('admin.loginError')
      if (err instanceof Error) {
        if (err.message.includes('fetch')) {
          errorMessage = 'Error de conexión - verifica tu conexión a internet'
        } else if (err.message.includes('network')) {
          errorMessage = 'Error de red - el servidor no está disponible'
        } else {
          errorMessage = `Error: ${err.message}`
        }
      }

      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="glass-card border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400 mb-2">
              {t('admin.title')}
            </h1>
            <p className="text-sm text-slate-400">
              {t('admin.loginSubtitle')}
            </p>
          </div>

          {searchParams.get('registered') === 'true' && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm text-green-400 text-center">
              Administrador registrado correctamente. Inicia sesión.
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              id="admin-email"
              name="email"
              label={t('admin.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('admin.emailPlaceholder')}
              required
              disabled={loading}
            />

            <Input
              id="admin-password"
              name="password"
              label={t('admin.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('admin.passwordPlaceholder')}
              required
              disabled={loading}
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? t('admin.loggingIn') : t('admin.login')}
            </Button>

            <div className="flex flex-col gap-2 text-center mt-4">
              <Link
                href="/admin/forgot-password"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>

              <Link
                href="/admin/register"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                title="Solo disponible si no existe ningún administrador"
              >
                configuración inicial
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
