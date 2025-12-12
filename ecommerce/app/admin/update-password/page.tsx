'use client'

import { updatePassword } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function UpdatePasswordPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await updatePassword(null, formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else {
            router.push('/admin/dashboard?passwordUpdated=true')
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="glass-card border border-white/10 p-8 rounded-2xl bg-white/5 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400 mb-2">
                            Nueva Contraseña
                        </h1>
                        <p className="text-sm text-slate-400">
                            Establece tu nueva contraseña segura
                        </p>
                    </div>

                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                label="Nueva Contraseña"
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
                            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
