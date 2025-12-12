'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Save, Loader2, CheckCircle2, AlertCircle, Phone, Mail, MapPin } from 'lucide-react'
import { Branding } from '@/types/models'
import { t } from '@/lib/i18n'

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

            setMessage({ type: 'success', text: t('admin.infoUpdated') })
            router.refresh()

            // Clear success message after 3 seconds
            setTimeout(() => setMessage(null), 3000)

        } catch (err: any) {
            console.error('Error saving branding:', err)
            setMessage({ type: 'error', text: err.message || t('admin.errorSaving') })
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


            {/* Datos de Contacto */}
            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium text-slate-200 border-b border-white/10 pb-2">{t('admin.contactInfoSection')}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="contact_email" className="text-sm text-slate-400 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> {t('admin.contactEmail')}
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
                        <p className="text-xs text-slate-500">{t('admin.contactEmailHelper')}</p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="contact_phone" className="text-sm text-slate-400 flex items-center gap-2">
                            <Phone className="w-4 h-4" /> {t('admin.contactPhone')}
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
                            <MapPin className="w-4 h-4" /> {t('admin.contactAddress')}
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
                            {t('admin.saving')}
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            {t('admin.saveChanges')}
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
