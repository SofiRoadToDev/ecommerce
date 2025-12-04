'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'

export function StoreHydration() {
  useEffect(() => {
    // Manually hydrate the store on the client side
    useCartStore.persist.rehydrate()
  }, [])

  return null
}
