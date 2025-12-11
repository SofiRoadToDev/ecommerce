import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase/auth'
import { getBranding } from './actions'
import { BrandingForm } from '@/components/admin/BrandingForm'

export const dynamic = 'force-dynamic'

export default async function BrandingPage() {
    // Require admin authentication
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
        redirect('/admin/login')
    }

    const brandingData = await getBranding()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Branding & Identity</h1>
                    <p className="text-gray-600 mt-1 dark:text-gray-400">
                        Customize your store's appearance and identity
                    </p>
                </div>
            </div>

            {/* Branding Form */}
            <BrandingForm initialData={brandingData} />
        </div>
    )
}
