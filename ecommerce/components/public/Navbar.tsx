'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { t } from '@/lib/i18n'
import { useCartStore } from '@/store/cartStore'

// Lazy load CartSheet (only loads when cart is opened)
const CartSheet = dynamic(() => import('./CartSheet').then(mod => ({ default: mod.CartSheet })), {
  ssr: false,
  loading: () => null
})

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const getTotalItems = useCartStore(state => state.getTotalItems)
  const items = useCartStore(state => state.items) // Direct subscription to items for reactivity

  // Fix hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const itemCount = mounted ? getTotalItems() : 0

  return (
    <>
      <nav className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-gray-900">
              {t('common.storeName')}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Sheet */}
      <CartSheet open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
