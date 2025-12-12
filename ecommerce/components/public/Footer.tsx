import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { t } from '@/lib/i18n'
import type { Branding } from '@/types/models'

async function getBranding(): Promise<Branding | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('branding')
    .select('*')
    .single()
  return data as unknown as Branding
}

export async function Footer() {
  const currentYear = new Date().getFullYear()
  const branding = await getBranding()

  // SEO: LocalBusiness Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    'name': branding?.brand_name || 'E-Commerce Store',
    'url': process.env.NEXT_PUBLIC_APP_URL,
    ...(branding?.logo_url && { 'logo': branding.logo_url }),
    ...(branding?.contact_email && { 'email': branding.contact_email }),
    ...(branding?.contact_phone && { 'telephone': branding.contact_phone }),
    ...(branding?.contact_address && {
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': branding.contact_address,
        // Assuming user puts full address, schema parsing is limited without structured fields
        // Ideally we would parse city/country but simple string is better than nothing
      }
    })
  }

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-bold mb-4">
              {branding?.brand_name || t('common.storeName')}
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mb-4">
              Quality products for your lifestyle. We are committed to providing the best shopping experience.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              {branding?.contact_address && (
                <p>📍 {branding.contact_address}</p>
              )}
              {branding?.contact_email && (
                <a href={`mailto:${branding.contact_email}`} className="hover:text-white transition-colors">
                  📧 {branding.contact_email}
                </a>
              )}
              {branding?.contact_phone && (
                <a href={`tel:${branding.contact_phone}`} className="hover:text-white transition-colors">
                  📞 {branding.contact_phone}
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/?category=electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link href="/?category=clothing" className="hover:text-white transition-colors">Clothing</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Shipping Policy</Link></li> {/* Placeholder */}
              <li><Link href="#" className="hover:text-white transition-colors">Returns</Link></li> {/* Placeholder */}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>
            © {currentYear} {branding?.brand_name || 'Store'}. {t('footer.copyright')}.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}