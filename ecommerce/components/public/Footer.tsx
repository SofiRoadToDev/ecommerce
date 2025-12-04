import { t } from '@/lib/i18n'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            © {currentYear} {t('footer.copyright')}.
          </p>
        </div>
      </div>
    </footer>
  )
}