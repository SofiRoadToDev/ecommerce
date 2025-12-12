import { createAdminClient } from '@/lib/supabase/admin'
import type { Branding } from '@/types/models'
import ContactFormClient from '@/components/public/ContactFormClient'
import { Mail, Phone, MapPin } from 'lucide-react'

export const metadata = {
    title: 'Contact Us',
    description: 'Get in touch with us for any questions or inquiries',
}

async function getBranding(): Promise<Branding | null> {
    const supabase = createAdminClient()

    const { data } = await supabase
        .from('branding')
        .select('*')
        .single()

    return data as unknown as Branding
}

export default async function ContactPage() {
    const branding = await getBranding()

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Contact Us
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        <ContactFormClient />
                    </div>

                    {/* Contact Info & Map */}
                    <div className="space-y-8">
                        {/* Contact Information */}
                        <div className="bg-gray-50 rounded-2xl p-8 space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                Get in Touch
                            </h2>

                            {branding?.contact_email && (
                                <div className="flex items-start gap-4">
                                    <div className="bg-slate-900 rounded-lg p-3">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                                        <a
                                            href={`mailto:${branding.contact_email}`}
                                            className="text-slate-600 hover:text-slate-900 transition-colors"
                                        >
                                            {branding.contact_email}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {branding?.contact_phone && (
                                <div className="flex items-start gap-4">
                                    <div className="bg-slate-900 rounded-lg p-3">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                                        <a
                                            href={`tel:${branding.contact_phone}`}
                                            className="text-slate-600 hover:text-slate-900 transition-colors"
                                        >
                                            {branding.contact_phone}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {branding?.contact_address && (
                                <div className="flex items-start gap-4">
                                    <div className="bg-slate-900 rounded-lg p-3">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">Address</h3>
                                        <p className="text-slate-600">
                                            {branding.contact_address}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Google Maps */}
                        {branding?.google_maps_embed && (
                            <div className="rounded-2xl overflow-hidden shadow-lg h-[400px]">
                                <iframe
                                    src={branding.google_maps_embed}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Store Location"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
