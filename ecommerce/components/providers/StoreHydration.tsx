'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cartStore'

export function StoreHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Only hydrate on the client side
    setHydrated(true)
    useCartStore.persist.rehydrate()
  }, [])

  // Don't render anything until hydrated
  if (!hydrated) {
    return null
  }

  return null
}
