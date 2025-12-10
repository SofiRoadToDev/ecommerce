'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { t } from '@/lib/i18n'

interface CartSheetProps {
  open: boolean
  onClose: () => void
}

export function CartSheet({ open, onClose }: CartSheetProps) {
  const [mounted, setMounted] = useState(false)
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore()

  // CRITICAL: Fix hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Don't render on server
  }

  const total = getTotalPrice()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Dialog open={open} onClose={onClose} title={t('cart.title')}>
      {items.length === 0 ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-6 text-center">{t('cart.empty')}</p>
          <Button onClick={onClose} variant="primary" className="bg-black hover:bg-gray-900">
            {t('cart.continueShopping')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Cart items */}
          <div className="flex-1 px-6 py-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200">
                {/* Image */}
                {item.image_url ? (
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatPrice(item.price)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 rounded-md bg-gray-800 hover:bg-gray-900 transition-colors disabled:opacity-50"
                      aria-label="Decrease quantity"
                      disabled={isNaN(item.quantity) || item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                    <span className="text-sm font-semibold w-8 text-center text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1.5 rounded-md bg-gray-800 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded-md hover:bg-red-50 text-red-600 ml-auto"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer with total and checkout */}
          <div className="border-t border-gray-200 px-6 py-4 space-y-4 bg-gray-50">
            <div className="flex items-center justify-between text-lg font-semibold text-black">
              <span>{t('cart.total')}</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" onClick={onClose}>
              <Button variant="primary" size="lg" className="w-full bg-black hover:bg-gray-900">
                {t('cart.checkout')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Dialog>
  )
}
