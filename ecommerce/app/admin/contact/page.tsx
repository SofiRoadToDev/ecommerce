
import { createAdminClient } from '@/lib/supabase/admin'
import ContactForm from '@/components/admin/contact-form'
import { AlertCircle } from 'lucide-react'
import { t } from '@/lib/i18n'
import type { Branding } from '@/types/models'

export default async function ContactPage() {
    const supabase = createAdminClient()

    // Obtener datos de branding (solo hay 1 registro generalmente)
    // Si no existe, pasamos objeto vacío y el form manejará el insert o upsert
    let { data: branding, error } = await supabase
        .from('branding')
        .select('*')
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 es "no rows returned"
        console.error('Error fetching branding:', error)
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">{t('admin.contactTitle')}</h1>
                    <p className="text-slate-400 mt-1">{t('admin.contactSubtitle')}</p>
                </div>
            </div>

            {!branding && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{t('admin.noBrandingYet')}</p>
                </div>
            )}

            <div className="glass-card p-6">
                <ContactForm initialData={branding as Branding | null} />
            </div>
        </div>
    )
}
