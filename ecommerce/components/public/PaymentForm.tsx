'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { formatPrice } from '@/lib/utils'
import { t } from '@/lib/i18n'
import { useCartStore } from '@/store/cartStore'

interface PaymentFormProps {
  orderId: string
  amount: number
}

export function PaymentForm({ orderId, amount }: PaymentFormProps) {
  const router = useRouter()
  const clearCart = useCartStore(state => state.clearCart)

  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {t('checkout.paymentDetails')}
        </h2>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-4">
            {t('checkout.total')}: {formatPrice(amount)}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* PayPal Buttons */}
        <div className="mb-6">
          <PayPalButtons
            createOrder={() => Promise.resolve(orderId)}
            onApprove={async (data, actions) => {
              try {
                // Capture the order
                if (actions.order) {
                  await actions.order.capture()
                }
                // Payment succeeded - clear cart and redirect
                clearCart()
                router.push('/checkout/success')
              } catch (err) {
                setError(err instanceof Error ? err.message : t('checkout.unexpectedError'))
              }
            }}
            onError={(err) => {
              console.error('PayPal error:', err)
              setError(t('checkout.paymentFailed'))
            }}
            style={{
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'paypal',
            }}
          />
        </div>

        {/* Security Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          {t('checkout.securePayment')}
        </p>
      </div>
    </div>
  )
}