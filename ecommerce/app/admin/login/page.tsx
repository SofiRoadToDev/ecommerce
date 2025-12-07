'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { t } from '@/lib/i18n'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      console.log('🚀 Intentando login con NextAuth:', { email })
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // Manejar la redirección manualmente
      })

      console.log('📊 Resultado del login:', result)

      if (result?.error) {
        console.error('❌ Error en login:', result.error)
        
        let errorMessage = result.error
        if (result.error.includes('credentials')) {
          errorMessage = 'Credenciales incorrectas'
        } else if (result.error.includes('network')) {
          errorMessage = 'Error de red - verifica tu conexión'
        } else if (result.error.includes('unauthorized')) {
          errorMessage = 'No autorizado - se requiere rol de administrador'
        }
        
        setError(errorMessage)
        setLoading(false)
        return
      }

      if (result?.ok) {
        console.log('✅ Login exitoso, redirigiendo...')
        // Redirigir al dashboard
        router.push('/admin/dashboard')
        router.refresh()
      }
    } catch (err) {
      console.error('💥 Error crítico en login:', err)
      
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('admin.title')}
            </h1>
            <p className="text-sm text-gray-600">
              {t('admin.loginSubtitle')}
            </p>
          </div>

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
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
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
          </form>
        </div>
      </div>
    </div>
  )
}