'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { t } from '@/lib/i18n'

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore(state => state.clearCart)

  useEffect(() => {
    // Clear cart on success page load
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-sm text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('checkout.success')}
        </h1>
        
        <p className="text-gray-600 mb-8">
          {t('checkout.successDetails') || 'Your order has been placed successfully. Check your email for the confirmation and tracking details.'}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/">
            <Button variant="primary" className="w-full">
              {t('cart.continueShopping')}
            </Button>
          </Link>
          
          <p className="text-sm text-gray-500">
            {t('checkout.orderReference')}<span className="font-mono">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
