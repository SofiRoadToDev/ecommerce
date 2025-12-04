'use client'

import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { t } from '@/lib/i18n'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        
        <h1 className="text-2xl font-bold text-red-900 mb-2">
          {t('common.error')}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {t('error.loadingProducts')}
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="primary">
            {t('common.retry')}
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="secondary"
          >
            {t('common.back')}
          </Button>
        </div>
      </div>
    </div>
  )
}