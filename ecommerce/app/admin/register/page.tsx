'use client'

import { registerFirstAdmin, checkFirstAdmin } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
    const router = useRouter()
    const [canRegister, setCanRegister] = useState<boolean | null>(null)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        checkFirstAdmin().then((allowed) => {
            if (!allowed) {
                router.replace('/admin/login')
            } else {
                setCanRegister(true)
            }
        })
    }, [router])

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        // Client-side validation for immediate feedback
        const pass = formData.get('password') as string
        const confirm = formData.get('confirmPassword') as string

        if (pass !== confirm) {
            setError("Las contraseñas no coinciden")
            setLoading(false)
            return
        }

        const result = await registerFirstAdmin(null, formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else {
            // Success
            router.push('/admin/login?registered=true')
        }
    }

    if (canRegister === null) return null // Loading check

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="glass-card border border-white/10 p-8 rounded-2xl bg-white/5 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400 mb-2">
                            Configuración Inicial
                        </h1>
                        <p className="text-sm text-slate-400">
                            Registra la cuenta de administrador global
                        </p>
                    </div>

                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                label="Email Administrativo"
                                name="email"
                                type="email"
                                placeholder="admin@ejemplo.com"
                                required
                                disabled={loading}
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                label="Contraseña"
                                name="password"
                                type="password"
                                placeholder="******"
                                required
                                disabled={loading}
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                label="Confirmar Contraseña"
                                name="confirmPassword"
                                type="password"
                                placeholder="******"
                                required
                                disabled={loading}
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white border-0"
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'Registrar Administrador'}
                        </Button>

                        <div className="text-center mt-4">
                            <Link href="/admin/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                                ¿Ya tienes cuenta? Iniciar Sesión
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
