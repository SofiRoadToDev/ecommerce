'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { t } from '@/lib/i18n'
import { useCartStore } from '@/store/cartStore'

// Lazy load CartSheet (only loads when cart is opened)
const CartSheet = dynamic(() => import('./CartSheet').then(mod => ({ default: mod.CartSheet })), {
  ssr: false,
  loading: () => null
})

interface BrandingData {
  brand_name: string
  logo_url: string | null
}

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const getTotalItems = useCartStore(state => state.getTotalItems)
  const items = useCartStore(state => state.items) // Direct subscription to items for reactivity

  const [branding, setBranding] = useState<BrandingData | null>(null)

  // Fix hydration
  useEffect(() => {
    setMounted(true)
    // Fetch branding data from public API
    fetch('/api/public/branding')
      .then(res => res.json())
      .then(data => setBranding(data))
      .catch(err => console.error('Failed to load branding', err))
  }, [])

  const itemCount = mounted ? getTotalItems() : 0

  return (
    <>
      <nav className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Store name */}
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-gray-900">
              {branding?.logo_url && (
                <Image src={branding.logo_url} alt="logo" width={32} height={32} className="object-contain" />
              )}
              <span>{branding?.brand_name || t('common.storeName')}</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Sheet */}
      {mounted && (
        <CartSheet open={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </>
  )
}
