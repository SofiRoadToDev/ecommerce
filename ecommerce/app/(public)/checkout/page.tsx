'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { t } from '@/lib/i18n'
import { checkoutSchema, type CheckoutFormData } from '@/lib/validations/checkout'

// Dynamic imports for heavy components (PayPal SDK)
const PayPalProvider = dynamic(
  () => import('@/components/public/PayPalProvider').then(mod => ({ default: mod.PayPalProvider })),
  {
    ssr: false,
    loading: () => <div className="text-center text-gray-600">Cargando PayPal...</div>
  }
)

const PaymentForm = dynamic(
  () => import('@/components/public/PaymentForm').then(mod => ({ default: mod.PaymentForm })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">{t('checkout.paymentDetails')}</h2>
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }
)

export default function CheckoutPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isLoadingOrder, setIsLoadingOrder] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { items, getTotalPrice } = useCartStore()

  // Fix hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema)
  })

  // Create PayPal order when shipping form is submitted
  const onShippingSubmit = async (data: CheckoutFormData) => {
    setIsLoadingOrder(true)
    setError(null)

    try {
      // Create PayPal order with customer data
      const response = await fetch('/api/create-paypal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            quantity: item.quantity,
          })),
          customer: {
            name: data.name,
            email: data.email,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            country: data.country,
          },
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t('checkout.paymentError'))
      }

      setOrderId(result.orderId)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('checkout.unexpectedError'))
    } finally {
      setIsLoadingOrder(false)
    }
  }

  if (!mounted) {
    return null
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('checkout.emptyCart')}
          </h1>
          <Link href="/">
            <Button variant="primary">
              {t('checkout.continueShopping')}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const total = getTotalPrice()

  return (
    <PayPalProvider>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {t('checkout.title')}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Shipping Form or Payment Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {!orderId ? (
                // Step 1: Shipping Information
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {t('checkout.shippingAddress')}
                  </h2>

                  <form onSubmit={handleSubmit(onShippingSubmit)} className="space-y-4">
                    <Input
                      label={t('checkout.email')}
                      type="email"
                      className="bg-white text-slate-800"
                      placeholder={t('checkout.placeholderEmail')}
                      error={errors.email?.message}
                      {...register('email')}
                    />

                    <Input
                      label={t('checkout.name')}
                      type="text"
                      className="bg-white text-slate-800"
                      placeholder={t('checkout.placeholderName')}
                      error={errors.name?.message}
                      {...register('name')}
                    />

                    <Input
                      label={t('checkout.address')}
                      type="text"
                      className="bg-white text-slate-800"
                      placeholder={t('checkout.placeholderAddress')}
                      error={errors.address?.message}
                      {...register('address')}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label={t('checkout.city')}
                        type="text"
                        className="bg-white text-slate-800"
                        placeholder={t('checkout.placeholderCity')}
                        error={errors.city?.message}
                        {...register('city')}
                      />

                      <Input
                        label={t('checkout.postalCode')}
                        type="text"
                        className="bg-white text-slate-800"
                        placeholder={t('checkout.placeholderPostalCode')}
                        error={errors.postalCode?.message}
                        {...register('postalCode')}
                      />
                    </div>

                    <Input
                      label={t('checkout.country')}
                      type="text"
                      className="bg-white text-slate-800"
                      placeholder={t('checkout.placeholderCountry')}
                      error={errors.country?.message}
                      {...register('country')}
                    />

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="rounded-md w-full bg-slate-900 hover:bg-slate-800 text-white px-5 transition-transform active:scale-95"
                      disabled={isLoadingOrder}
                    >
                      {isLoadingOrder ? t('checkout.processing') : t('checkout.continueToPayment')}
                    </Button>
                  </form>
                </>
              ) : (
                // Step 2: Payment (PayPal Buttons)
                <PaymentForm orderId={orderId} amount={total} />
              )}
            </div>

            {/* Right: Order Summary */}
            <div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {t('checkout.orderSummary')}
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {item.image_url && (
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {t('cart.quantity')}{item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>{t('cart.total')}</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalProvider>
  )
}