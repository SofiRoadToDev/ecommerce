'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Save, Loader2, CheckCircle2, AlertCircle, Building, Phone, Mail, MapPin, Palette, Image as ImageIcon, Type } from 'lucide-react'
import { Branding } from '@/types/models'

interface ContactFormProps {
    initialData: Branding | null
}

export default function ContactForm({ initialData }: ContactFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const [formData, setFormData] = useState({
        brand_name: initialData?.brand_name || '',
        logo_url: initialData?.logo_url || '',
        primary_color: initialData?.primary_color || '#2563eb',
        contact_email: initialData?.contact_email || '',
        contact_phone: initialData?.contact_phone || '',
        contact_address: initialData?.contact_address || '',
    })

    const supabase = createClient()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const dataToSave = {
                ...formData,
                updated_at: new Date().toISOString() // Assuming updated_at exists, if not database handles modified_at often
                // If 'created_at' is required on insert, Supabase handles it usually default now()
            }

            let error

            if (initialData?.id) {
                // Update existing
                const { error: updateError } = await supabase
                    .from('branding')
                    .update(dataToSave)
                    .eq('id', initialData.id)
                error = updateError
            } else {
                // Insert new (assuming this is the first record)
                const { error: insertError } = await supabase
                    .from('branding')
                    .insert([dataToSave])
                error = insertError
            }

            if (error) throw error

            setMessage({ type: 'success', text: 'Información actualizada correctamente' })
            router.refresh()

            // Clear success message after 3 seconds
            setTimeout(() => setMessage(null), 3000)

        } catch (err: any) {
            console.error('Error saving branding:', err)
            setMessage({ type: 'error', text: err.message || 'Error al guardar la información' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p>{message.text}</p>
                </div>
            )}

            {/* Identidad de Marca */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-200 border-b border-white/10 pb-2">Identidad de Marca</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="brand_name" className="text-sm text-slate-400 flex items-center gap-2">
                            <Type className="w-4 h-4" /> Nombre de la Tienda
                        </label>
                        <input
                            type="text"
                            id="brand_name"
                            name="brand_name"
                            value={formData.brand_name}
                            onChange={handleChange}
                            placeholder="Ej. Sofia Store"
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="primary_color" className="text-sm text-slate-400 flex items-center gap-2">
                            <Palette className="w-4 h-4" /> Color Primario (Hex)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={formData.primary_color}
                                onChange={handleChange}
                                name="primary_color"
                                className="h-[46px] w-[50px] bg-transparent border border-white/10 rounded-lg cursor-pointer p-1"
                            />
                            <input
                                type="text"
                                name="primary_color"
                                value={formData.primary_color}
                                onChange={handleChange}
                                className="flex-1 bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                            />
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <label htmlFor="logo_url" className="text-sm text-slate-400 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> URL del Logo
                        </label>
                        <input
                            type="text"
                            id="logo_url"
                            name="logo_url"
                            value={formData.logo_url}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/logo.png"
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                        {formData.logo_url && (
                            <div className="mt-2 p-4 bg-white/5 rounded-lg border border-white/10 inline-block">
                                <img src={formData.logo_url} alt="Logo Preview" className="h-12 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Datos de Contacto */}
            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium text-slate-200 border-b border-white/10 pb-2">Información de Contacto</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="contact_email" className="text-sm text-slate-400 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Email de Contacto Público
                        </label>
                        <input
                            type="email"
                            id="contact_email"
                            name="contact_email"
                            value={formData.contact_email}
                            onChange={handleChange}
                            placeholder="contacto@tienda.com"
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                        <p className="text-xs text-slate-500">Este email se mostrará a los clientes en las notificaciones.</p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="contact_phone" className="text-sm text-slate-400 flex items-center gap-2">
                            <Phone className="w-4 h-4" /> Teléfono / WhatsApp
                        </label>
                        <input
                            type="text"
                            id="contact_phone"
                            name="contact_phone"
                            value={formData.contact_phone}
                            onChange={handleChange}
                            placeholder="+54 11 1234-5678"
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <label htmlFor="contact_address" className="text-sm text-slate-400 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Dirección Física
                        </label>
                        <input
                            type="text"
                            id="contact_address"
                            name="contact_address"
                            value={formData.contact_address}
                            onChange={handleChange}
                            placeholder="Av. Siempre Viva 123, Springfield"
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Guardar Cambios
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
