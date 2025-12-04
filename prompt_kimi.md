# 🤖 Development Prompts for Kimi (Phase by Phase)

## 🟢 SETUP & CONTEXT (Paste this first)
You are an expert Senior Full Stack Developer specialized in Next.js, Supabase, and Stripe. We are building a **production-ready e-commerce platform** for small businesses that includes a complete admin panel for autonomous operation.

**Reference the specific Stack and Database Schema defined below:**
[COPIA Y PEGA AQUÍ EL CONTENIDO DE SPECS.MD]

**IMPORTANT: Follow the exact versions and architecture specified in SPECS.MD:**
- Next.js 15.1.0 (App Router)
- React 18.3.1
- TypeScript 5.3.3 (strict mode)
- Tailwind CSS 3.4.1
- Folder structure with route groups: `app/(public)` and `app/admin`
- Component organization: `components/ui`, `components/public`, `components/admin`
- Type safety: shared types in `/types`, validated with Zod

**CRITICAL: Follow the Design System & UI/UX Guidelines from SPECS.MD:**
- **ONLY use Tailwind CSS** - Zero custom CSS files or inline styles
- **Mobile-first** approach - Design for mobile, enhance for desktop
- **Modern & minimalist** - Inspired by Vercel, Stripe, Linear
- Use exact color classes: `bg-blue-600`, `text-gray-900`, etc.
- Use exact spacing: `px-6 py-2.5`, `gap-6`, `space-y-4`
- Use Lucide React icons (0.314.0)
- Follow component patterns from Design System section

**Internationalization (i18n):**
- Site language controlled by `NEXT_PUBLIC_LOCALE` env var (en, es, pt)
- All UI text must use `t()` function from `lib/i18n`
- Never hardcode text strings in components

We will build this incrementally. Do not write all the code at once. **Wait for my confirmation after each phase before continuing.**

---

## 🚀 PHASE 1: Project Setup & Database Connection
**Goal:** Initialize the Next.js app and connect it to Supabase with proper schema and security.

1.  **Scaffold:** Create a Next.js 15.1.0 project with App Router, TypeScript, and Tailwind CSS:
    ```bash
    npx create-next-app@15.1.0 ecommerce --typescript --tailwind --app --no-src-dir
    ```
2.  **Folder Structure:** Set up the ecosystemic architecture:
    * `app/(public)/` - Public routes (home, checkout)
    * `app/admin/` - Admin routes (will be protected in Phase 11)
    * `components/ui/` - Reusable UI primitives
    * `components/public/` - Public components
    * `components/admin/` - Admin components
    * `lib/` - Utilities, Supabase clients, validations
    * `store/` - Zustand stores
    * `types/` - TypeScript types
3.  **Supabase Clients:** Create three clients in `lib/supabase/`:
    * `server.ts` - Server-side client (SSR)
    * `client.ts` - Client-side client
    * `admin.ts` - Admin client with service role (for CRUD operations)
4.  **SQL Setup:** Provide the raw SQL code to run in Supabase SQL Editor:
    * Create `products`, `orders`, and `order_items` tables with indexes
    * Create `product-images` storage bucket with RLS policies
    * Include Row Level Security (RLS) policies:
      - **Products:** Public read; Admin ALL (via service role)
      - **Orders:** Insert for anon; Users can read their own; Admin ALL
      - **Order_items:** Users can read their own; Admin ALL
    * Add CHECK constraint for order status: `'pending'`, `'paid'`, `'processing'`, `'shipped'`, `'ready_for_pickup'`, `'completed'`
5.  **RPC Function:** Create SQL function `decrement_stock(p_product_id, p_quantity)` to atomically decrease stock.
6.  **Seed Data:** Provide SQL to insert 5-10 dummy products with different categories and stock levels.
7.  **Package.json:** List all dependencies with exact versions from SPECS.MD.
8.  **i18n Setup:** Create internationalization system:
    * `lib/i18n/translations.ts` - Export translations object with en, es, pt keys
    * `lib/i18n/index.ts` - Export `t(key)` function that reads `NEXT_PUBLIC_LOCALE`
    * Include initial translations for common UI strings (loading, error, retry, etc.)
    * Add `NEXT_PUBLIC_LOCALE=en` to .env.example
9.  **Tailwind Config:** Set up tailwind.config.ts with:
    * Inter font family (using next/font)
    * Custom colors if needed (or use default Tailwind palette)
    * Ensure JIT mode is enabled

*Output request: Complete folder structure, Supabase client files, SQL script with tables + storage bucket + RLS + function + seed data, package.json, i18n system, tailwind.config.ts.*

---

## 🎨 PHASE 2: Product Catalog (Core)
**Goal:** Display products from Supabase with optimized images and basic filtering.

1.  **Type Definitions:** Create `types/models.ts` with `Product`, `CartItem` interfaces.
2.  **Utility Functions:** Create `lib/utils.ts`:
    * `cn()` - classnames helper for merging Tailwind classes
    * `formatPrice()` - Format price with currency symbol (respects locale from env)
3.  **UI Primitives:** Create base components in `components/ui/`:
    * `button.tsx` - Primary, secondary, ghost variants (follow Design System patterns)
    * `badge.tsx` - Status badges with color variants
4.  **ProductCard Component:** Create `components/public/ProductCard.tsx`:
    * Follow Design System Product Card pattern exactly
    * Use `next/image` with aspect-square, rounded-xl
    * Hover effect: scale-105 transition
    * Display: image, title (line-clamp-2), price (text-lg font-bold), category badge
    * "Add to Cart" button using Button component
    * Show stock count with Badge component
    * **Use `t()` for all text:** "Add to Cart", "In Stock", etc.
    * Only Tailwind classes (no custom CSS)
5.  **Home Page:** Implement `app/(public)/page.tsx`:
    * Server-side fetch products from Supabase using server client
    * Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12`
    * Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`
    * Use TypeScript types for products
6.  **Basic Filter:** Add category filter buttons (not dropdown):
    * Use Button component with ghost variant
    * Active state: primary variant
    * Client-side filtering
7.  **Navbar:** Create `components/public/Navbar.tsx`:
    * Use `ShoppingCart` icon from Lucide React
    * Logo text with `text-xl font-bold`
    * Sticky top navigation: `sticky top-0 bg-white border-b border-gray-200 z-50`
    * Cart icon placeholder (functional in Phase 4)
    * **Use `t()` for logo text if applicable**

*Output request: Type definitions, utility functions, UI primitive components (button, badge), ProductCard following Design System, Home page with proper grid and container, filter buttons, Navbar with styling.*

---

## ✨ PHASE 3: UI Polish & States
**Goal:** Add loading states, error handling, and professional polish.

1.  **Loading States:** Create `components/public/ProductSkeleton.tsx`:
    * Follow Design System skeleton pattern: `animate-pulse` with gray rectangles
    * Match ProductCard dimensions exactly
    * Example: `<div className="h-48 bg-gray-200 rounded-lg mb-4"></div>`
2.  **Error Handling:**
    * Create `app/(public)/error.tsx` (Next.js error boundary)
    * Centered layout with error icon (Lucide `AlertCircle`)
    * User-friendly message using `t('common.error')`
    * "Retry" button using Button component
    * Styling: `bg-red-50 text-red-700 border border-red-200 rounded-xl p-6`
3.  **Out of Stock UI:**
    * Update ProductCard:
      - When `stock = 0`: add `opacity-60` to entire card
      - Show "Out of Stock" Badge: `bg-red-50 text-red-700 border-red-200`
      - Disable Button: `disabled:opacity-50 disabled:cursor-not-allowed`
      - Use `t('products.outOfStock')` for badge text
4.  **Filter Enhancement:**
    * Use URL search params (with `useSearchParams` hook)
    * "All" button to clear filter
    * Active button uses primary variant, inactive uses ghost
    * Container: `flex gap-2 overflow-x-auto pb-2` (mobile scroll)
5.  **Footer:** Create `components/public/Footer.tsx`:
    * Simple centered layout: `bg-gray-50 border-t border-gray-200 py-8`
    * Copyright text: `text-sm text-gray-600`
    * Use `t()` for all text

*Output request: ProductSkeleton with animate-pulse, error boundary with proper styling, updated ProductCard with out-of-stock states, filter with URL params and mobile-friendly scroll, Footer with proper spacing.*

---

## 🛒 PHASE 4: Cart System (⚠️ REFORMULATED based on WORKFLOW_KIMI_CLAUDE.md)
**Goal:** Implement global cart state with LocalStorage persistence and proper SSR hydration.

---

### ⚠️ CRITICAL TECHNICAL WARNINGS (READ FIRST!)

1. **Next.js 15 Hydration Issue:**
   - LocalStorage is NOT available during SSR (server-side rendering)
   - Zustand store with `persist` middleware will cause hydration mismatch
   - **SOLUTION:** Use `useEffect` to mount cart UI only on client-side
   - Pattern: `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), [])`

2. **Client Components Required:**
   - ALL cart-related components MUST use `'use client'` directive
   - CartSheet, Navbar (already client), ProductCard interactions

3. **Stock Validation:**
   - ALWAYS validate against `product.stock` before adding/updating
   - Prevent adding more items than available stock
   - Handle stock = 0 edge case

4. **Type Safety:**
   - `CartItem` interface already exists in `types/models.ts` - DO NOT recreate
   - Use exact interface from types/models.ts

---

### 📝 STEP-BY-STEP IMPLEMENTATION

#### **STEP 1: Verify CartItem Type (DO NOT MODIFY)**

Check that `types/models.ts` has this interface (already exists from Phase 1):

```typescript
export interface CartItem {
  id: string
  title: string
  price: number
  image_url: string | null
  quantity: number
  stock: number  // IMPORTANT: Include stock for validation
}
```

✅ **Action:** Just verify it exists. DO NOT modify or recreate.

---

#### **STEP 2: Create Zustand Cart Store**

Create `store/cartStore.ts` with this EXACT structure:

```typescript
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
```

✅ **Key Features:**
- Validates stock before adding/updating
- Removes item if quantity = 0
- Persists to LocalStorage automatically
- Helper functions for totals

---

#### **STEP 3: Create Dialog UI Component**

Create `components/ui/dialog.tsx` using Headless UI:

```typescript
'use client'

import { Fragment } from 'react'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function Dialog({ open, onClose, children, title }: DialogProps) {
  return (
    <Transition show={open} as={Fragment}>
      <HeadlessDialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        {/* Slide-over panel */}
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="fixed inset-y-0 right-0 flex max-w-full">
            <HeadlessDialog.Panel className="w-screen max-w-md">
              <div className="flex h-full flex-col bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  {title && (
                    <HeadlessDialog.Title className="text-lg font-semibold text-gray-900">
                      {title}
                    </HeadlessDialog.Title>
                  )}
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  {children}
                </div>
              </div>
            </HeadlessDialog.Panel>
          </div>
        </Transition.Child>
      </HeadlessDialog>
    </Transition>
  )
}
```

---

#### **STEP 4: Create CartSheet Component**

Create `components/public/CartSheet.tsx`:

```typescript
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

  return (
    <Dialog open={open} onClose={onClose} title={t('cart.title')}>
      {items.length === 0 ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <p className="text-gray-600 mb-6">{t('cart.empty')}</p>
          <Button onClick={onClose} variant="primary">
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
                {item.image_url && (
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
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
                      className="p-1 rounded-md hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
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
          <div className="border-t border-gray-200 px-6 py-4 space-y-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>{t('cart.total')}</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" onClick={onClose}>
              <Button variant="primary" size="lg" className="w-full">
                {t('cart.checkout')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Dialog>
  )
}
```

✅ **Key Features:**
- `mounted` state prevents hydration mismatch
- Empty state with i18n
- Quantity controls with stock validation
- Remove button
- Total calculation

---

#### **STEP 5: Update Navbar to Open Cart**

Modify `components/public/Navbar.tsx` to integrate cart:

```typescript
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { t } from '@/lib/i18n'
import { useCartStore } from '@/store/cartStore'
import { CartSheet } from './CartSheet'

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const getTotalItems = useCartStore(state => state.getTotalItems)

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
```

---

#### **STEP 6: Update ProductCard to Add to Cart**

Modify `components/public/ProductCard.tsx` to add cart functionality:

```typescript
'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { t } from '@/lib/i18n'
import type { Product } from '@/types/models'
import { useCartStore } from '@/store/cartStore'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem)
  const isOutOfStock = product.stock === 0

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addItem(product)
    }
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${isOutOfStock ? 'opacity-60' : ''}`}>
      {/* Image */}
      {product.image_url && (
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {product.title}
          </h3>
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {isOutOfStock ? (
            <Badge variant="error">
              {t('products.outOfStock')}
            </Badge>
          ) : (
            <Badge variant="success">
              {product.stock} {t('products.inStock')}
            </Badge>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {t('products.addToCart')}
        </Button>
      </div>
    </div>
  )
}
```

---

### ⚡ EDGE CASES YOU MUST HANDLE

1. **Hydration Mismatch:**
   - ✅ Use `mounted` state in CartSheet and Navbar
   - ✅ Return `null` on server-side render

2. **Stock Validation:**
   - ✅ Check `product.stock` before adding
   - ✅ Disable increment button when `quantity >= stock`
   - ✅ Show warning if trying to exceed stock

3. **Empty Cart:**
   - ✅ Show empty state with i18n message
   - ✅ "Continue Shopping" button

4. **Quantity Edge Cases:**
   - ✅ Remove item if quantity becomes 0
   - ✅ Prevent negative quantities

5. **LocalStorage:**
   - ✅ Zustand persist handles this automatically
   - ✅ Don't access during SSR

---

### ✅ VERIFICATION CHECKLIST

Before submitting, verify:

- [ ] **Build passes:** `npm run build -- --no-lint` completes successfully
- [ ] **No hydration errors:** Check browser console for warnings
- [ ] **Cart persists:** Add items, refresh page, items still there
- [ ] **Stock validation works:** Cannot add more than available stock
- [ ] **Badge updates:** Cart badge shows correct item count
- [ ] **Empty state works:** Shows correct message when cart is empty
- [ ] **Quantity controls work:** +/- buttons update correctly
- [ ] **Remove button works:** Clicking trash icon removes item
- [ ] **Total calculates correctly:** Sum of all items matches displayed total
- [ ] **i18n works:** All text uses `t()` function
- [ ] **Dialog animations work:** Slide-in/out transitions smooth
- [ ] **Types are correct:** No TypeScript errors

---

### 📦 FILES TO CREATE/MODIFY

**Create (3 new files):**
1. `store/cartStore.ts` - Zustand store
2. `components/ui/dialog.tsx` - Dialog primitive
3. `components/public/CartSheet.tsx` - Cart drawer

**Modify (2 existing files):**
4. `components/public/Navbar.tsx` - Add cart button and CartSheet
5. `components/public/ProductCard.tsx` - Add "Add to Cart" functionality

**Verify (1 existing file):**
6. `types/models.ts` - CartItem interface exists (DO NOT MODIFY)

---

*Output request: Zustand store with full TypeScript types, Dialog component with animations, CartSheet with hydration fix, updated Navbar with cart integration, updated ProductCard with add to cart button. All files must build without errors and handle hydration correctly.*

---

## 💳 PHASE 5: Checkout Page - UI Only (⚠️ REFORMULATED based on WORKFLOW_KIMI_CLAUDE.md)
**Goal:** Build checkout page layout and form validation (without Stripe integration yet).

---

### ⚠️ CRITICAL TECHNICAL WARNINGS (READ FIRST!)

1. **Next.js 15 - No searchParams in this phase:**
   - Checkout page is simple, no searchParams needed
   - Success page also no searchParams
   - Just Server Components fetching cart from client-side store

2. **React Hook Form + Zod Integration:**
   - Use `@hookform/resolvers/zod` for Zod integration
   - Pattern: `useForm({ resolver: zodResolver(schema) })`
   - Register inputs: `{...register('fieldName')}`
   - Errors: `errors.fieldName?.message`

3. **Form Submission (Phase 5 = No Payment Yet):**
   - In Phase 5, form just validates and shows "Ready for payment"
   - Phase 6 will add Stripe payment
   - For now, just console.log the form data

4. **Cart Access in Server Components:**
   - Cart is in LocalStorage (client-side only)
   - Checkout page needs to be Client Component to access cart
   - Use `'use client'` directive

5. **Success Page - Clear Cart:**
   - Use `useEffect` to clear cart on mount
   - Only clear once (check if already cleared)

6. **i18n - New Translation Keys:**
   - Need to add `checkout.*` keys to translations.ts
   - All form labels, errors, placeholders

---

### 📝 STEP-BY-STEP IMPLEMENTATION

#### **STEP 1: Create Input UI Component**

Create `components/ui/input.tsx`:

```typescript
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-900">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border border-gray-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'placeholder:text-gray-400',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
```

---

#### **STEP 2: Create Zod Validation Schema**

Create `lib/validations/checkout.ts`:

```typescript
import { z } from 'zod'

export const checkoutSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address is too long'),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City is too long'),
  postalCode: z
    .string()
    .min(3, 'Postal code must be at least 3 characters')
    .max(20, 'Postal code is too long'),
  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country is too long')
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
```

---

#### **STEP 3: Add Checkout Translation Keys**

Add to `lib/i18n/translations.ts` in **each language** (en, es, pt):

```typescript
// In ENGLISH (en):
"checkout.title": "Checkout",
"checkout.email": "Email",
"checkout.name": "Full Name",
"checkout.address": "Address",
"checkout.city": "City",
"checkout.postalCode": "Postal Code",
"checkout.country": "Country",
"checkout.orderSummary": "Order Summary",
"checkout.submitOrder": "Continue to Payment",
"checkout.emptyCart": "Your cart is empty",
"checkout.continueShopping": "Continue Shopping",

// In SPANISH (es):
"checkout.title": "Pago",
"checkout.email": "Correo Electrónico",
"checkout.name": "Nombre Completo",
"checkout.address": "Dirección",
"checkout.city": "Ciudad",
"checkout.postalCode": "Código Postal",
"checkout.country": "País",
"checkout.orderSummary": "Resumen del Pedido",
"checkout.submitOrder": "Continuar al Pago",
"checkout.emptyCart": "Tu carrito está vacío",
"checkout.continueShopping": "Continuar Comprando",

// In PORTUGUESE (pt):
"checkout.title": "Pagamento",
"checkout.email": "E-mail",
"checkout.name": "Nome Completo",
"checkout.address": "Endereço",
"checkout.city": "Cidade",
"checkout.postalCode": "Código Postal",
"checkout.country": "País",
"checkout.orderSummary": "Resumo do Pedido",
"checkout.submitOrder": "Continuar para Pagamento",
"checkout.emptyCart": "Seu carrinho está vazio",
"checkout.continueShopping": "Continuar Comprando",
```

---

#### **STEP 4: Create Checkout Page**

Create `app/(public)/checkout/page.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { t } from '@/lib/i18n'
import { checkoutSchema, type CheckoutFormData } from '@/lib/validations/checkout'

export default function CheckoutPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { items, getTotalPrice } = useCartStore()

  // Fix hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema)
  })

  const onSubmit = async (data: CheckoutFormData) => {
    // Phase 5: Just validate and log
    // Phase 6: Will integrate with Stripe
    console.log('Checkout data:', data)
    console.log('Cart items:', items)
    console.log('Total:', getTotalPrice())

    // TODO: Phase 6 will create PaymentIntent here
    alert('Form validated! Stripe integration in Phase 6')
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('checkout.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Shipping Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Shipping Information
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label={t('checkout.email')}
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label={t('checkout.name')}
                type="text"
                placeholder="John Doe"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label={t('checkout.address')}
                type="text"
                placeholder="123 Main St"
                error={errors.address?.message}
                {...register('address')}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('checkout.city')}
                  type="text"
                  placeholder="New York"
                  error={errors.city?.message}
                  {...register('city')}
                />

                <Input
                  label={t('checkout.postalCode')}
                  type="text"
                  placeholder="10001"
                  error={errors.postalCode?.message}
                  {...register('postalCode')}
                />
              </div>

              <Input
                label={t('checkout.country')}
                type="text"
                placeholder="United States"
                error={errors.country?.message}
                {...register('country')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : t('checkout.submitOrder')}
              </Button>
            </form>
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
                        {item.quantity} × {formatPrice(item.price)}
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
  )
}
```

---

#### **STEP 5: Create Success Page**

Create `app/(public)/checkout/success/page.tsx`:

```typescript
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
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 mb-8">
          Check your email for order details and tracking information.
        </p>

        {/* Continue Shopping Button */}
        <Link href="/">
          <Button variant="primary" size="lg" className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}
```

---

### ⚡ EDGE CASES YOU MUST HANDLE

1. **Empty Cart:**
   - ✅ Show empty state if cart is empty
   - ✅ "Continue Shopping" button

2. **Form Validation Errors:**
   - ✅ Show errors inline below each field
   - ✅ Use Zod error messages

3. **Hydration Mismatch:**
   - ✅ Use `mounted` state in checkout page
   - ✅ Return `null` before mounting

4. **Success Page Without Previous Order:**
   - ✅ Always show success message (user navigated directly)
   - ✅ Clear cart anyway (idempotent)

5. **Form Submission:**
   - ✅ Phase 5: Just console.log (no payment yet)
   - ✅ Phase 6: Will add Stripe integration

---

### ✅ VERIFICATION CHECKLIST

Before submitting, verify:

- [ ] **Build passes:** `npm run build -- --no-lint` completes successfully
- [ ] **Input component works:** Text fields render correctly
- [ ] **Form validation works:** Errors show on invalid input
- [ ] **Zod schema correct:** All 6 fields validated
- [ ] **Empty cart handled:** Shows empty state message
- [ ] **Order summary shows:** Cart items display correctly
- [ ] **Total calculates:** Matches cart total
- [ ] **Success page works:** Shows confirmation message
- [ ] **Cart clears:** Cart is empty after success page
- [ ] **i18n works:** All text uses `t()` function
- [ ] **No TypeScript errors:** Types are correct
- [ ] **No hydration errors:** Check browser console

---

### 📦 FILES TO CREATE/MODIFY

**Create (4 new files):**
1. `components/ui/input.tsx` - Input component with validation
2. `lib/validations/checkout.ts` - Zod schema
3. `app/(public)/checkout/page.tsx` - Checkout page
4. `app/(public)/checkout/success/page.tsx` - Success page

**Modify (1 existing file):**
5. `lib/i18n/translations.ts` - Add checkout.* keys (10 keys × 3 languages = 30 lines)

**Note about documentation:**
Create `docs/fases/fase-5-completada.md` with:
- Files created/modified
- Verification checklist results
- Build status
- Next steps (Phase 6: Stripe integration)

---

*Output request: Input UI component, Zod checkout schema, Checkout page with React Hook Form validation and split layout, Success page with cart clearing, i18n keys added. All files must build without errors and validate correctly. Phase 6 will add Stripe payment integration.*

---

## 💰 PHASE 6: PayPal Payment Integration (⚠️ REFORMULATED)
**Goal:** Integrate PayPal Commerce Platform with robust server-side validation and security.

---

### ⚠️ CRITICAL SECURITY & TECHNICAL WARNINGS (READ FIRST!)

1. **NEVER Trust Client Data (Security Critical):**
   - Client can manipulate cart prices in localStorage
   - ALWAYS fetch actual prices from Supabase on server-side
   - Calculate totals server-side, never accept from client
   - Validate stock availability on server before creating PayPal Order

2. **PayPal API Keys (Two Different Keys):**
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - Safe for client-side
   - `PAYPAL_CLIENT_SECRET` - Server-side only, NEVER expose to client
   - Use client ID in client components (PayPalScriptProvider)
   - Use both client ID and secret in API routes for authentication

3. **Error Handling is Critical:**
   - PayPal API can fail (network, invalid data, insufficient funds)
   - User's payment can be declined
   - Products can go out of stock between cart and payment
   - ALL error messages must use i18n (t() function)

4. **PayPal Packages:**
   - `@paypal/checkout-server-sdk` (server-side SDK) - Use in API routes
   - `@paypal/react-paypal-js` (React components) - Use for PayPal Buttons

5. **TypeScript Types:**
   - Import types from PayPal SDK where available
   - Define custom types for webhook events as needed

---

### 📝 STEP-BY-STEP IMPLEMENTATION

---

#### **STEP 1: Install PayPal Dependencies**

Run these commands:

```bash
cd ecommerce
npm install @paypal/checkout-server-sdk@^1.0.3
npm install @paypal/react-paypal-js@^8.1.3
```

**Why these packages:**
- `@paypal/checkout-server-sdk` - Server-side PayPal SDK for creating orders
- `@paypal/react-paypal-js` - React components for PayPal Buttons

---

#### **STEP 2: Add Environment Variables**

Add to `.env.example`:

```bash
# PayPal (Phase 6)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_WEBHOOK_ID=xxx
```

**Instructions for user:**
- Get these from PayPal Developer Dashboard → My Apps & Credentials
- Use SANDBOX credentials for development
- NEVER commit real secret keys to git

---

#### **STEP 3: Create PayPal Utility (Server-Side)**

Create `lib/paypal/server.ts`:

```typescript
import paypal from '@paypal/checkout-server-sdk'

function getPayPalEnvironment() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured')
  }

  // Use sandbox for development, live for production
  if (process.env.NODE_ENV === 'production') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret)
  }
  return new paypal.core.SandboxEnvironment(clientId, clientSecret)
}

export function getPayPalClient() {
  return new paypal.core.PayPalHttpClient(getPayPalEnvironment())
}

export async function createPayPalOrder(amount: number, currency: string = 'USD') {
  const client = getPayPalClient()
  const request = new paypal.orders.OrdersCreateRequest()

  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: currency,
        value: amount.toFixed(2)
      }
    }]
  })

  const response = await client.execute(request)
  return response.result
}

export async function capturePayPalOrder(orderId: string) {
  const client = getPayPalClient()
  const request = new paypal.orders.OrdersCaptureRequest(orderId)
  const response = await client.execute(request)
  return response.result
}

export async function getPayPalOrderDetails(orderId: string) {
  const client = getPayPalClient()
  const request = new paypal.orders.OrdersGetRequest(orderId)
  const response = await client.execute(request)
  return response.result
}
```

**Why:**
- Centralized PayPal client initialization
- Environment-aware (sandbox vs production)
- Helper functions for order lifecycle
- Type-safe with PayPal SDK types

---

#### **STEP 4: Create PayPal Order API Route**

Create `app/api/create-paypal-order/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createPayPalOrder } from '@/lib/paypal/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Validation schema for request body
const createPayPalOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      quantity: z.number().int().min(1),
    })
  ).min(1, 'Cart must have at least one item'),
})

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json()
    const validation = createPayPalOrderSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { items } = validation.data

    // 2. Fetch actual product data from Supabase (NEVER trust client prices)
    const supabase = createServerClient()
    const productIds = items.map(item => item.id)

    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, title, price, stock')
      .in('id', productIds)

    if (fetchError || !products) {
      console.error('Error fetching products:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch product data' },
        { status: 500 }
      )
    }

    // 3. Validate stock availability and calculate total
    let total = 0
    const orderItems = []

    for (const cartItem of items) {
      const product = products.find(p => p.id === cartItem.id)

      if (!product) {
        return NextResponse.json(
          { error: `Product ${cartItem.id} not found` },
          { status: 404 }
        )
      }

      // Check stock availability
      if (product.stock < cartItem.quantity) {
        return NextResponse.json(
          {
            error: 'Insufficient stock',
            product: product.title,
            available: product.stock,
            requested: cartItem.quantity
          },
          { status: 400 }
        )
      }

      // Calculate with server-side prices only
      const subtotal = product.price * cartItem.quantity
      total += subtotal

      orderItems.push({
        id: product.id,
        title: product.title,
        quantity: cartItem.quantity,
        price: product.price,
      })
    }

    // 4. Create PayPal Order
    const order = await createPayPalOrder(total, 'USD')

    // 5. Store pending order in database
    const adminSupabase = createAdminClient()
    const { error: insertError } = await adminSupabase
      .from('pending_orders')
      .insert({
        paypal_order_id: order.id,
        order_items: orderItems,
        total_amount: total,
      })

    if (insertError) {
      console.error('Error storing pending order:', insertError)
      return NextResponse.json(
        { error: 'Failed to store order data' },
        { status: 500 }
      )
    }

    // 6. Return order ID to client
    return NextResponse.json({
      orderId: order.id,
      amount: total,
    })

  } catch (error) {
    console.error('Error creating PayPal order:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
```

**Why each step:**
1. Validate request with Zod (prevent malformed data)
2. Fetch from DB to get real prices (security: never trust client)
3. Validate stock (prevent overselling)
4. Create PayPal Order (returns order ID)
5. Store pending order in `pending_orders` table (for webhook processing)
6. Return only orderId (webhook will process payment capture)

---

#### **STEP 5: Create PayPal Client Utility**

Create `lib/paypal/client.ts`:

```typescript
function getPayPalClientId(): string {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  if (!clientId) {
    throw new Error('NEXT_PUBLIC_PAYPAL_CLIENT_ID is not defined')
  }

  return clientId
}

export const paypalOptions = {
  clientId: getPayPalClientId(),
  currency: 'USD',
  intent: 'capture',
}
```

**Why:**
- Environment variable validation
- Centralized PayPal client configuration
- Used by PayPalScriptProvider in checkout page

---

#### **STEP 6: Update Checkout Page with PayPal**

Replace `app/(public)/checkout/page.tsx` content:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { t } from '@/lib/i18n'
import { checkoutSchema, type CheckoutFormData } from '@/lib/validations/checkout'
import { paypalOptions } from '@/lib/paypal/client'
import { PaymentForm } from '@/components/public/PaymentForm'

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
      // Store shipping data in sessionStorage for payment form
      sessionStorage.setItem('shippingData', JSON.stringify(data))

      // Create PayPal order
      const response = await fetch('/api/create-paypal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            quantity: item.quantity,
          })),
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
    <PayPalScriptProvider options={paypalOptions}>
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
                      placeholder={t('checkout.placeholderEmail')}
                      error={errors.email?.message}
                      {...register('email')}
                    />

                    <Input
                      label={t('checkout.name')}
                      type="text"
                      placeholder={t('checkout.placeholderName')}
                      error={errors.name?.message}
                      {...register('name')}
                    />

                    <Input
                      label={t('checkout.address')}
                      type="text"
                      placeholder={t('checkout.placeholderAddress')}
                      error={errors.address?.message}
                      {...register('address')}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label={t('checkout.city')}
                        type="text"
                        placeholder={t('checkout.placeholderCity')}
                        error={errors.city?.message}
                        {...register('city')}
                      />

                      <Input
                        label={t('checkout.postalCode')}
                        type="text"
                        placeholder={t('checkout.placeholderPostalCode')}
                        error={errors.postalCode?.message}
                        {...register('postalCode')}
                      />
                    </div>

                    <Input
                      label={t('checkout.country')}
                      type="text"
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
                      className="w-full mt-6"
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
    </PayPalScriptProvider>
  )
}
```

**Why this structure:**
- Two-step flow: shipping info first, then payment
- Store shipping data in sessionStorage (for reference)
- Wrap entire page with PayPalScriptProvider
- Only create PayPal Order after shipping validation
- Show errors inline with i18n

---

#### **STEP 7: Create Payment Form Component**

Create `components/public/PaymentForm.tsx`:

```typescript
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
      <h2 className="text-xl font-semibold text-gray-900">
        {t('checkout.paymentDetails')}
      </h2>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Total Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {t('checkout.total')}
          </span>
          <span className="text-lg font-bold text-blue-900">
            {formatPrice(amount)}
          </span>
        </div>
      </div>

      {/* PayPal Buttons */}
      <PayPalButtons
        createOrder={() => {
          // Return the order ID created in the previous step
          return Promise.resolve(orderId)
        }}
        onApprove={async (data, actions) => {
          try {
            // Capture the payment
            if (actions.order) {
              const details = await actions.order.capture()
              console.log('Payment captured:', details)
            }

            // Clear cart and redirect to success page
            clearCart()
            router.push('/checkout/success')
          } catch (err) {
            console.error('Error capturing payment:', err)
            setError(t('checkout.paymentFailed'))
          }
        }}
        onError={(err) => {
          console.error('PayPal error:', err)
          setError(t('checkout.paymentFailed'))
        }}
        onCancel={() => {
          setError(t('checkout.paymentError'))
        }}
        style={{
          layout: 'vertical',
          shape: 'rect',
          label: 'pay',
        }}
      />

      {/* Security Note */}
      <p className="text-xs text-gray-500 text-center">
        {t('checkout.securePayment')}
      </p>
    </div>
  )
}
```

**Why:**
- Separate component for payment (cleaner code)
- Use PayPal Buttons with order ID from previous step
- Handle payment capture on approval
- Clear cart only on success
- Show errors inline with i18n
- Display total amount prominently

---

#### **STEP 8: Add Translation Keys**

Add to `lib/i18n/translations.ts` in **each language** (en, es, pt):

**ENGLISH (en):**
```typescript
"checkout.continueToPayment": "Continue to Payment",
"checkout.paymentDetails": "Payment Details",
"checkout.payNow": "Pay Now",
"checkout.total": "Total",
"checkout.processing": "Processing...",
"checkout.securePayment": "Secure payment powered by PayPal",
"checkout.paymentError": "Payment failed. Please try again.",
"checkout.paymentFailed": "Payment was not successful. Please try again.",
"checkout.unexpectedError": "An unexpected error occurred. Please try again.",
```

**SPANISH (es):**
```typescript
"checkout.continueToPayment": "Continuar al Pago",
"checkout.paymentDetails": "Detalles del Pago",
"checkout.payNow": "Pagar Ahora",
"checkout.total": "Total",
"checkout.processing": "Procesando...",
"checkout.securePayment": "Pago seguro con tecnología de PayPal",
"checkout.paymentError": "El pago falló. Por favor intenta de nuevo.",
"checkout.paymentFailed": "El pago no fue exitoso. Por favor intenta de nuevo.",
"checkout.unexpectedError": "Ocurrió un error inesperado. Por favor intenta de nuevo.",
```

**PORTUGUESE (pt):**
```typescript
"checkout.continueToPayment": "Continuar para Pagamento",
"checkout.paymentDetails": "Detalhes do Pagamento",
"checkout.payNow": "Pagar Agora",
"checkout.total": "Total",
"checkout.processing": "Processando...",
"checkout.securePayment": "Pagamento seguro com tecnologia PayPal",
"checkout.paymentError": "O pagamento falhou. Tente novamente.",
"checkout.paymentFailed": "O pagamento não foi bem-sucedido. Tente novamente.",
"checkout.unexpectedError": "Ocorreu um erro inesperado. Tente novamente.",
```

---

### ⚡ EDGE CASES YOU MUST HANDLE

1. **Out of Stock Between Cart and Payment:**
   - ✅ Validate stock in API route
   - ✅ Return clear error with product name
   - ✅ User must return to cart to adjust

2. **PayPal SDK Not Loaded:**
   - ✅ PayPal buttons won't render until SDK loads
   - ✅ PayPalScriptProvider handles loading state

3. **Payment Declined/Cancelled:**
   - ✅ Show PayPal error message via onError handler
   - ✅ Don't clear cart (allow retry)
   - ✅ Don't redirect to success
   - ✅ Handle onCancel event separately

4. **Network Errors:**
   - ✅ Catch all errors in try/catch
   - ✅ Show user-friendly message with i18n

5. **Empty Cart at Checkout:**
   - ✅ Already handled - show empty state

6. **Invalid Product IDs:**
   - ✅ API route returns 404 with product ID

7. **PayPal Keys Not Set:**
   - ✅ Environment variable validation in utilities
   - ✅ Throw error with clear message

8. **Pending Orders Not Stored:**
   - ✅ Validate database insert before returning order ID
   - ✅ Return 500 error if pending order creation fails

---

### ✅ VERIFICATION CHECKLIST (OBLIGATORIO)

Before submitting, verify ALL of these:

- [ ] **Packages installed:** `npm list @paypal/checkout-server-sdk @paypal/react-paypal-js`
- [ ] **Build passes:** `npm run build -- --no-lint` completes successfully
- [ ] **Environment variables:** Added to .env.example (with comments)
- [ ] **Pending orders table created:** Run supabase-setup.sql with pending_orders table
- [ ] **API route works:**
  - [ ] Validates request with Zod
  - [ ] Fetches prices from Supabase (not from client)
  - [ ] Validates stock availability
  - [ ] Creates PayPal Order successfully
  - [ ] Stores pending order in database
  - [ ] Returns orderId
- [ ] **Checkout page works:**
  - [ ] Shipping form validates correctly
  - [ ] Creates PayPal order on submit
  - [ ] Shows PayPal Buttons after shipping form
  - [ ] Handles errors gracefully
- [ ] **Payment form works:**
  - [ ] PayPal Buttons render correctly
  - [ ] Captures payment via PayPal
  - [ ] Clears cart on success
  - [ ] Redirects to success page
  - [ ] Shows errors on failure
  - [ ] Handles payment cancellation
- [ ] **i18n complete:** ALL new strings use `t()` (9 new keys × 3 languages = 27 translations)
- [ ] **Edge cases handled:** All 8 edge cases from list above
- [ ] **No hardcoded strings:** grep -r '"Pay Now"' app/ components/ returns nothing
- [ ] **TypeScript errors:** Zero errors in IDE and build
- [ ] **Test with PayPal Sandbox:**
  - [ ] Create sandbox Business and Personal accounts
  - [ ] Test successful payment flow
  - [ ] Test payment cancellation

---

### 🧪 TESTING GUIDE

**PayPal Sandbox Setup:**
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com)
2. Create a Sandbox Business account (for receiving payments)
3. Create a Sandbox Personal account (for testing as buyer)
4. Get credentials from Business account: Client ID and Secret
5. Add to .env: `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`

**Test Scenarios:**
1. ✅ Complete purchase with sandbox Personal account
2. ✅ Cancel payment - should show error without clearing cart
3. ✅ Remove product from DB while in checkout - should fail gracefully at order creation
4. ✅ Test with insufficient stock - should fail with clear error message
5. ✅ Test pending_orders table - verify order is stored before payment

**PayPal Test Flow:**
1. Add products to cart
2. Go to checkout
3. Fill shipping info → Click "Continue to Payment"
4. Click PayPal button
5. Login with sandbox Personal account email/password
6. Approve payment
7. Verify redirect to success page
8. Check pending_orders table is cleared
9. Check orders table has new order

---

### 📦 FILES TO CREATE/MODIFY

**Create (4 new files):**
1. `lib/paypal/server.ts` - Server-side PayPal SDK client
2. `lib/paypal/client.ts` - Client-side PayPal configuration
3. `app/api/create-paypal-order/route.ts` - PayPal Order creation API
4. `components/public/PaymentForm.tsx` - Payment form with PayPal Buttons

**Modify (3 existing files):**
5. `app/(public)/checkout/page.tsx` - Add two-step flow with PayPal
6. `lib/i18n/translations.ts` - Add 9 new keys × 3 languages
7. `supabase-setup.sql` - Add pending_orders table

**Update (1 file):**
8. `.env.example` - Add PayPal keys with comments

---

### 💡 RECUERDA PARA FUTURAS FASES

**Concepts learned in Phase 6:**
- PayPal has two SDKs: server (`@paypal/checkout-server-sdk`) and client (`@paypal/react-paypal-js`)
- NEVER trust client data for prices - always fetch from database
- Use `pending_orders` table to store order data between creation and webhook
- PayPal uses standard decimal amounts (not cents like Stripe)
- Payment capture happens in client (onApprove) but webhook is still needed for order creation

**For Phase 7:**
- Webhook will handle PAYMENT.CAPTURE.COMPLETED event
- Webhook will retrieve pending order from database
- Webhook will create order and order_items in database
- Webhook will decrement stock using RPC function
- Webhook will delete pending order after processing

---

*Output request: Complete code for all 4 new files, modified checkout page with two-step flow, PaymentForm component with error handling, i18n keys added (show full translations object excerpt), supabase-setup.sql with pending_orders table, build output proving compilation, test results with PayPal sandbox account.*

---

## ✅ PHASE 7: Webhooks & Order Creation
**Goal:** Securely confirm payments via webhooks and manage stock.

1.  **Webhook Route:** Create `app/api/webhooks/paypal/route.ts`:
    * Handle `PAYMENT.CAPTURE.COMPLETED` event
    * Retrieve pending order from `pending_orders` table using PayPal order ID
    * Create order record in `orders` table (status='completed')
    * Create `order_items` records from pending order data
    * Call `decrement_stock()` RPC function for each product
    * Delete pending order from database
    * Return 200 status
    * **NOTE:** In production, should verify webhook signature using `PAYPAL_WEBHOOK_ID`
2.  **Error Handling:**
    * Handle `PAYMENT.CAPTURE.DENIED` event (cleanup pending order)
    * Log webhook errors for debugging
    * Always return 200 to PayPal (even on errors)
3.  **Testing:** Document how to test webhooks:
    * Use PayPal Developer Dashboard → Webhooks simulator
    * Or manually trigger payment in sandbox and check webhook delivery
    * Verify pending order is deleted after successful webhook
    * Verify order and order_items are created
    * Verify stock is decremented

*Output request: Webhook handler with event processing, order creation logic, pending order cleanup, stock decrement integration, testing instructions.*

---

## 📧 PHASE 8: Email System (Resend)
**Goal:** Send order confirmation emails automatically.

1.  **Install Resend:** Add `resend` package and set up API key.
2.  **Email Utility:** Create `utils/email.ts` with `sendOrderEmail(to, type, orderData)` function.
3.  **Email Templates:** Create 4 simple HTML templates in `emails/` folder:
    * `order-confirmed.html` → "✅ Your order #XXX is confirmed! Total: $XXX"
    * `order-processing.html` → "📦 We're preparing your order #XXX"
    * `order-shipped.html` → "🚚 Your order #XXX is on the way!"
    * `order-ready.html` → "🎉 Your order #XXX is ready for pickup"

    *Note: Keep templates simple - plain HTML with inline CSS. Or use React Email if you prefer.*
4.  **Webhook Integration:** In the webhook handler (Phase 7), after creating the order, call `sendOrderEmail()` to send "Order Confirmed" email.
5.  **Testing:** Test by completing a payment and checking email delivery.

*Output request: Resend integration, email utility function, 4 email templates, webhook integration for confirmation email.*

---

## 🔔 PHASE 9: Automated Status Notifications
**Goal:** Auto-send emails when order status changes (for fulfillment workflow).

1.  **Enable HTTP Extension:** Document SQL command:
    ```sql
    CREATE EXTENSION IF NOT EXISTS http;
    ```
2.  **API Route for Status Emails:** Create `app/api/send-order-email/route.ts`:
    * Receive: `{ order_id, status, customer_email, total_amount }`
    * Select appropriate email template based on status
    * Send email via Resend
    * Return success/error response
    * Add basic security: check a shared secret or validate request source
3.  **PostgreSQL Trigger:** Create trigger to auto-call API when order status updates:
    ```sql
    CREATE OR REPLACE FUNCTION notify_order_status_change()
    RETURNS TRIGGER AS $$
    DECLARE
      webhook_url text := 'YOUR_PRODUCTION_URL/api/send-order-email';
    BEGIN
      IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status != 'pending' THEN
        PERFORM net.http_post(
          url := webhook_url,
          headers := '{"Content-Type": "application/json", "X-Secret": "YOUR_SECRET"}'::jsonb,
          body := json_build_object(
            'order_id', NEW.id,
            'status', NEW.status,
            'customer_email', NEW.customer_email,
            'total_amount', NEW.total_amount
          )::text
        );
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER on_order_status_update
    AFTER UPDATE OF status ON orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_order_status_change();
    ```
4.  **Testing:** Document how to test:
    * Update order status in Supabase Dashboard
    * Verify email is sent automatically
    * Test all status transitions

*Output request: API route for status emails, SQL trigger code, security implementation, testing documentation.*

---

## 🌐 PHASE 10: Deployment & Documentation
**Goal:** Prepare for production deployment and create client handoff documentation.

### Part A: Deployment Configuration

1.  **Environment Variables:** Create `.env.example` with all required variables:
    ```bash
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    SUPABASE_SERVICE_ROLE_KEY=  # For webhook stock updates

    # Stripe
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # Client-side
    STRIPE_SECRET_KEY=  # Server-side
    STRIPE_WEBHOOK_SECRET=  # From Stripe Dashboard after webhook setup

    # Resend
    RESEND_API_KEY=

    # App Config
    NEXT_PUBLIC_APP_URL=https://yourstore.com
    EMAIL_SECRET=  # For securing email API route
    ```

2.  **Netlify Config:** Create `netlify.toml`:
    ```toml
    [build]
      command = "npm run build"
      publish = ".next"

    [[plugins]]
      package = "@netlify/plugin-nextjs"
    ```

3.  **Build Test:** Document command to test build locally:
    ```bash
    npm run build && npm start
    ```

### Part B: External Service Setup Guides

4.  **Stripe Webhook Setup Guide:** Create `docs/STRIPE_SETUP.md`:
    * Go to Stripe Dashboard → Developers → Webhooks
    * Add endpoint: `https://yourstore.com/api/webhooks/stripe`
    * Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
    * Copy signing secret to `STRIPE_WEBHOOK_SECRET`

5.  **Supabase Final Config:** Create `docs/SUPABASE_SETUP.md`:
    * Run all SQL scripts in order
    * Enable `http` extension
    * Update trigger webhook URL with production domain
    * Update RLS policies if needed

### Part C: Client Documentation

6.  **Client README:** Create `CLIENT_README.md`:
    * **Managing Products:** How to add/edit/delete products in Supabase
    * **Viewing Orders:** How to query orders table
    * **Updating Order Status:** Step-by-step with screenshots:
      1. Open Supabase → orders table
      2. Find order by ID or email
      3. Edit status field
      4. Save (email sends automatically)
    * **Checking Email Logs:** How to view sent emails in Resend dashboard
    * **Checking Payments:** How to view transactions in Stripe dashboard

7.  **Testing Guide:** Create `TESTING.md`:
    * **Test Cards:** Stripe test card numbers (4242 4242 4242 4242 for success)
    * **Test Scenarios:**
      - Successful payment flow
      - Insufficient stock error
      - Card declined error
      - Email notification on status change
    * **Local Testing:** How to use Stripe CLI for webhooks

8.  **Troubleshooting Guide:** Add section to CLIENT_README.md:
    * Webhook not firing → Check Stripe Dashboard → Webhooks → Recent deliveries
    * Email not sending → Check Resend dashboard logs
    * Stock not updating → Check Supabase logs for function errors
    * Payment succeeded but no order → Check webhook logs and Supabase logs

### Part D: Final Polish

9.  **SEO Metadata:** Add to pages:
    * Home: title, description
    * Checkout: `<meta name="robots" content="noindex">` (don't index checkout)
    * Success: noindex

10. **Final Checklist:**
    * ✅ No console errors in browser
    * ✅ All images use `next/image`
    * ✅ Mobile responsive (test on phone)
    * ✅ Complete purchase flow works end-to-end
    * ✅ Email notifications work for all statuses
    * ✅ Stock decrements correctly
    * ✅ Out of stock products can't be purchased
    * ✅ Build succeeds without warnings

*Output request: .env.example, netlify.toml, all documentation files (STRIPE_SETUP.md, SUPABASE_SETUP.md, CLIENT_README.md, TESTING.md), SEO metadata implementation, final checklist verification.*

---

## 🔐 PHASE 11: Admin Authentication & Layout
**Goal:** Create secure admin panel with authentication and basic layout.

1.  **Auth Utility:** Create `lib/auth.ts`:
    * `hashPassword()` - Hash password with bcrypt
    * `verifyPassword()` - Compare password with hash
    * `createSession()` - Create JWT or session token
    * `verifySession()` - Verify token validity
2.  **Middleware:** Create `middleware.ts` in project root:
    * Protect all `/admin/*` routes
    * Check for valid session cookie
    * Redirect to `/admin/login` if not authenticated
    * Allow `/admin/login` without auth
3.  **Login API:** Create `app/api/auth/admin/route.ts`:
    * POST endpoint that receives `{ password }`
    * Verify against `ADMIN_PASSWORD_HASH` from env
    * Create HTTP-only session cookie (use `iron-session` or similar)
    * Return success/error with consistent API format
    * TypeScript types for request/response
4.  **Login Page:** Create `app/admin/login/page.tsx`:
    * Simple form with password input
    * Client-side validation with Zod
    * Call login API
    * Redirect to `/admin/dashboard` on success
    * Show error message on failure
5.  **Admin Layout:** Create `app/admin/layout.tsx`:
    * Sidebar navigation with links: Dashboard, Products, Orders, Logout
    * Top bar with logo and admin badge
    * Responsive (collapsible sidebar on mobile)
    * Uses Lucide React icons
    * Logout button that clears session
6.  **Dashboard Page:** Create `app/admin/dashboard/page.tsx` (placeholder for Phase 12):
    * Simple welcome message
    * Empty stats cards (will populate in Phase 12)

*Output request: Auth utilities, middleware with route protection, login API with session management, login page, admin layout with navigation, dashboard placeholder.*

---

## 🛍️ PHASE 12: Product Management (CRUD)
**Goal:** Complete admin panel for managing products with image uploads.

1.  **Zod Schemas:** Create `lib/validations/product.ts`:
    * `productSchema` - Validate product fields (title, description, price, category, stock)
    * `productFormSchema` - For form validation (client-side)
2.  **UI Components:** Create in `components/ui/`:
    * `input.tsx` - Text input with label and error
    * `textarea.tsx` - Multiline text input
    * `select.tsx` - Dropdown select
    * `table.tsx` - Data table with sorting
3.  **Image Upload Component:** Create `components/admin/ImageUpload.tsx`:
    * File input for single image
    * Preview before upload
    * Upload to Supabase Storage `product-images` bucket
    * Show upload progress
    * Return public URL
    * Validate file type (image only) and size (< 5MB)
4.  **Product Form:** Create `components/admin/ProductForm.tsx`:
    * Form with React Hook Form 7.49.3 + Zod validation
    * Fields: title, description, price, category, stock, image
    * ImageUpload component for product image
    * Submit creates/updates product via admin Supabase client
    * Show success/error toast or message
    * TypeScript types for form data
5.  **Product Table:** Create `components/admin/ProductTable.tsx`:
    * Display all products in table
    * Columns: Image (thumbnail), Title, Category, Price, Stock, Actions
    * Actions: Edit (icon button), Delete (icon button with confirmation)
    * Search/filter by title or category (client-side)
    * Use Table UI component
    * Delete confirmation dialog (using Dialog UI component)
6.  **Products List Page:** Create `app/admin/products/page.tsx`:
    * Fetch all products server-side using admin client
    * "Add Product" button (links to new product page)
    * Render ProductTable
    * Handle delete action (API call to delete + revalidate)
7.  **New Product Page:** Create `app/admin/products/new/page.tsx`:
    * Render ProductForm in "create" mode
    * On submit: insert into DB, upload image, redirect to products list
8.  **Edit Product Page:** Create `app/admin/products/[id]/edit/page.tsx`:
    * Fetch product by ID server-side
    * Render ProductForm in "edit" mode with pre-filled data
    * On submit: update in DB, handle image change, redirect to products list
9.  **Update Dashboard:** Update `app/admin/dashboard/page.tsx`:
    * Add "Low Stock Alerts" card (products with stock < 5)
    * Add "Total Products" count
    * Use admin client to fetch data

*Output request: Zod product schemas, UI components (input, textarea, select, table), ImageUpload component, ProductForm with validation, ProductTable with actions, all product CRUD pages, updated dashboard with stats.*

---

## 📦 PHASE 13: Order Management
**Goal:** Admin panel for viewing and managing orders with status updates.

1.  **Zod Schemas:** Create `lib/validations/order.ts`:
    * `orderStatusSchema` - Validate status enum
    * `orderFilterSchema` - For filtering orders
2.  **Type Definitions:** Update `types/models.ts`:
    * `Order` - Full order with items array
    * `OrderStatus` - Type for status enum
    * `OrderWithDetails` - Order joined with order_items and product info
3.  **Order Table:** Create `components/admin/OrderTable.tsx`:
    * Display orders with columns: ID (short), Date, Customer Email, Total, Status, Actions
    * Status badge with color coding (pending: gray, paid: blue, shipped: green, etc.)
    * Actions: View Details, Update Status dropdown
    * Filters: Status (dropdown), Date range (optional: use date picker or manual input)
    * Search by customer email
    * Pagination or infinite scroll for large datasets
4.  **Order Details Modal:** Create `components/admin/OrderDetailsModal.tsx`:
    * Dialog component showing full order details
    * Customer info: name, email, shipping address (formatted)
    * Order items: product title, quantity, price, subtotal
    * Total amount
    * Stripe payment ID (with link to Stripe dashboard)
    * Current status with history (if tracked)
    * Close button
5.  **Orders List Page:** Create `app/admin/orders/page.tsx`:
    * Fetch orders server-side with joins to get product details
    * Use admin client
    * Render OrderTable with filters
    * Handle status update: call API, trigger email automatically (via DB trigger), revalidate
6.  **Status Update API:** Create `app/api/admin/orders/[id]/status/route.ts`:
    * PATCH endpoint protected by middleware
    * Receive new status
    * Validate with Zod
    * Update order status in DB using admin client
    * Database trigger will send email automatically
    * Return success
7.  **Update Dashboard:** Final updates to `app/admin/dashboard/page.tsx`:
    * Add "Pending Orders" count (status = 'paid' or 'processing')
    * Add "Total Sales" sum (sum of total_amount where status in ['paid', 'processing', 'shipped', 'completed'])
    * Add "Recent Orders" list (last 5 orders with link to details)
    * Stats cards with icons and colors
8.  **Admin Documentation:** Update `CLIENT_README.md`:
    * Add section "Using the Admin Panel"
    * Login instructions
    * How to add/edit/delete products
    * How to upload product images
    * How to view and manage orders
    * How to update order status (and explain email is sent automatically)
    * Screenshots or step-by-step guide

*Output request: Order Zod schemas, updated types, OrderTable with filters and status update, OrderDetailsModal, orders list page, status update API, fully functional dashboard with all stats, updated CLIENT_README with admin guide.*

---

## 🎯 Summary of Deliverables

By the end of all 13 phases, you will have delivered:

✅ Fully functional e-commerce platform
✅ Secure payment processing with Stripe
✅ Automated inventory management with stock validation
✅ Email notification system for order updates
✅ **Complete admin panel for autonomous operation:**
  - Product management (CRUD with image uploads)
  - Order management (view, filter, status updates)
  - Dashboard with sales stats and alerts
  - Secure authentication
✅ Production-ready deployment configuration
✅ Complete client documentation (public + admin usage)
✅ Testing guides and troubleshooting

**Total cost to run:** $0/month on free tiers (until significant scale)
**Client capability:** 100% autonomous - can manage products, orders, and fulfillment without developer help
**Production ready:** Yes, can handle real transactions immediately after deployment
**Target market:** Small businesses without technical knowledge

---

## 🚀 Optional Future Enhancements (Upsell Opportunities)

After delivering the complete platform, you can offer these upgrades:

### Tier 2 Enhancements ($200-400 each)
- Product variants (size, color, SKU management)
- Multiple images per product with gallery
- Customer reviews and ratings system
- Discount codes / coupon system
- Export orders to CSV
- Advanced analytics dashboard

### Tier 3 Enhancements ($500-800 each)
- Customer accounts with order history
- Abandoned cart recovery emails
- Inventory alerts via email/SMS
- Multi-admin with role-based permissions
- Product import/export via CSV
- Multi-currency support
- Integration with shipping providers (tracking numbers)
