import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { t } from '@/lib/i18n'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-sm text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {t('error.pageNotFound')}
        </h2>
        <p className="text-gray-600 mb-8">
          {t('error.pageNotFoundDetails')}
        </p>
        <Link href="/">
          <Button variant="primary">
            {t('common.backHome')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
