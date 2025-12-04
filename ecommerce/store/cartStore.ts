import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types/models'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        const items = get().items
        const existingItem = items.find(item => item.id === product.id)

        if (existingItem) {
          // Product already in cart - increment quantity
          // Validate against stock
          if (existingItem.quantity >= product.stock) {
            console.warn('Cannot add more items than available stock')
            return
          }
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          })
        } else {
          // New product - add to cart
          if (product.stock === 0) {
            console.warn('Cannot add out of stock product')
            return
          }
          const cartItem: CartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            image_url: product.image_url,
            category: product.category,
            quantity: 1,
            stock: product.stock
          }
          set({ items: [...items, cartItem] })
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter(item => item.id !== productId) })
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          get().removeItem(productId)
          return
        }

        const items = get().items
        const item = items.find(i => i.id === productId)

        // Validate against stock
        if (item && quantity > item.stock) {
          console.warn('Cannot exceed available stock')
          return
        }

        set({
          items: items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }),
    {
      name: 'cart-storage' // LocalStorage key
    }
  )
)
