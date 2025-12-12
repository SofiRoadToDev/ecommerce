'use client'

import { resetPassword } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        setSuccess(false)

        const result = await resetPassword(null, formData)

        if (result?.error) {
            setError(result.error)
        } else {
            setSuccess(true)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="glass-card border border-white/10 p-8 rounded-2xl bg-white/5 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400 mb-2">
                            Recuperar Contraseña
                        </h1>
                        <p className="text-sm text-slate-400">
                            Te enviaremos un enlace para restablecer tu acceso
                        </p>
                    </div>

                    {!success ? (
                        <form action={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    placeholder="admin@ejemplo.com"
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
                                {loading ? 'Enviando...' : 'Enviar Enlace'}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400">
                                <p>¡Correo enviado!</p>
                                <p className="text-sm mt-1 text-green-400/80">Revisa tu bandeja de entrada y sigue el enlace para crear una nueva contraseña.</p>
                            </div>
                        </div>
                    )}

                    <div className="text-center mt-6">
                        <Link href="/admin/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                            Volver al Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
