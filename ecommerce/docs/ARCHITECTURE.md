# 📐 Architecture Documentation

## 🏗️ Folder Structure

```
ecommerce/
├── app/
│   ├── (public)/              # Public route group - customer-facing pages
│   │   ├── page.tsx           # Product catalog (home)
│   │   ├── layout.tsx         # Public layout
│   │   └── checkout/          # Checkout flow
│   │       ├── page.tsx       # Two-step checkout (shipping → payment)
│   │       └── success/page.tsx # Order confirmation
│   ├── admin/                 # Admin route group - protected
│   │   ├── layout.tsx         # Admin layout (sidebar, nav)
│   │   ├── dashboard/page.tsx # Stats overview
│   │   ├── products/          # Product management
│   │   │   ├── page.tsx       # Product list
│   │   │   ├── new/page.tsx   # Create product
│   │   │   └── [id]/edit/page.tsx
│   │   └── orders/            # Order management
│   │       ├── page.tsx       # Order list
│   │       └── [id]/page.tsx  # Order details
│   └── api/                   # API routes
│       ├── auth/
│       │   └── admin/route.ts # Admin login API
│       ├── create-paypal-order/route.ts # PayPal order creation
│       ├── send-order-email/route.ts
│       └── webhooks/
│           └── paypal/route.ts # PayPal webhook handler
├── components/
│   ├── ui/                    # Reusable UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── table.tsx
│   ├── public/                # Public-facing components
│   │   ├── Navbar.tsx          # Store name via common.storeName
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductSkeleton.tsx
│   │   ├── CartSheet.tsx
│   │   └── PaymentForm.tsx     # PayPal Buttons integration
│   └── admin/                 # Admin components
│       ├── AdminNav.tsx
│       ├── ProductForm.tsx
│       ├── ProductTable.tsx
│       ├── OrderTable.tsx
│       └── StatsCard.tsx
├── lib/
│   ├── supabase/
│   │   ├── server.ts          # Server-side client
│   │   ├── client.ts          # Client-side client
│   │   └── admin.ts           # Admin client (service role)
│   ├── i18n/
│   │   ├── translations.ts    # All translations (en, es, pt)
│   │   └── index.ts           # t() function
│   ├── paypal/                # PayPal integration
│   │   ├── server.ts          # Server-side PayPal client
│   │   └── client.ts          # Client-side PayPal configuration
│   ├── email.ts               # Email utilities
│   ├── utils.ts               # Shared utilities (cn, formatPrice)
│   └── validations/           # Zod schemas
│       ├── product.ts
│       ├── order.ts
│       └── auth.ts
├── store/
│   └── cartStore.ts           # Zustand cart store
├── types/
│   ├── database.ts            # Supabase generated types
│   └── models.ts              # App-level types
├── middleware.ts              # Auth middleware (protect /admin/*)
└── Configuration files...
```

## 🔄 Route Groups Architecture

### `(public)` - Customer-Facing Routes
- **Purpose**: All pages accessible to customers
- **Layout**: Public layout with navbar, footer
- **Authentication**: None required
- **Examples**: Home, product catalog, checkout

### `admin` - Admin Panel Routes
- **Purpose**: Protected admin functionality
- **Layout**: Admin layout with sidebar navigation
- **Authentication**: Password-based (simple, secure)
- **Examples**: Dashboard, product management, order management

## 💳 PayPal Integration Architecture

### Payment Flow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Checkout Page │    │  PayPal Order   │    │  PayPal API     │
│                 │◄──►│  API Route      │◄──►│                 │
│ - Shipping Form │    │                 │    │ - Order         │
│ - Payment Form  │    │ - Validate      │    │   Creation      │
│ - Order Summary │    │   Stock/Prices  │    │ - Payment       │
└─────────────────┘    └─────────────────┘    │   Processing    │
       │                       │               └─────────────────┘
       ▼                       ▼                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  PaymentForm    │    │  Supabase DB    │    │  Email Service  │
│  Component      │    │                 │    │                 │
│                 │    │ - Products      │    │ - Order         │
│ - PayPal        │    │ - Orders        │    │   Confirmation  │
│   Buttons       │    │ - Order Items   │    │ - Status        │
│ - Payment       │    │ - Pending       │    │   Updates       │
│   Capture       │    │   Orders        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Security Implementation
1. **Never trust client prices** - Always fetch from database
2. **Stock validation** before payment creation
3. **Server-side total calculation** only
4. **Pending orders storage** for webhook processing
5. **Webhook signature verification** for payment confirmation

## 🧩 Component Organization

### `components/ui/` - Design System Primitives
Reusable, unstyled components that implement the design system:
- Buttons, inputs, dialogs, tables
- No business logic
- Highly composable
- Follow accessibility best practices

### `components/public/` - Public Components
Customer-facing components with business logic:
- ProductCard, CartSheet, Navbar, FilterButtons
- Use UI primitives
- Handle user interactions
- Integrate with Zustand stores
- Category translation via CATEGORY_MAP (FilterButtons)

### `components/admin/` - Admin Components
Admin-specific components:
- ProductForm, ProductTable, OrderTable
- Use admin Supabase client
- Handle CRUD operations
- Form validation with Zod

## 🔄 Data Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Comp   │    │  Server Comp    │    │   Supabase DB   │
│                 │    │                 │    │                 │
│ - CartSheet     │◄──►│ - ProductList   │◄──►│ - products      │
│ - ProductCard   │    │ - OrderDetails  │    │ - orders        │
│ - PaymentForm   │    │ - AdminStats    │    │ - order_items   │
└─────────────────┘    └─────────────────┘    │ - pending_orders│
       │                       │               └─────────────────┘
       ▼                       ▼                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Zustand Store  │    │  Supabase       │    │  PayPal API     │
│                 │    │  Clients        │    │                 │
│ - Cart State    │    │                 │    │ - Order         │
│ - Persistence   │    │ - server.ts     │    │   Creation      │
│                 │    │ - client.ts     │    │ - Payment       │
└─────────────────┘    └─────────────────┘    │   Capture       │
                                              └─────────────────┘
```

### Client Components
- Handle user interactions
- Manage local state (cart)
- Call API routes for mutations
- Integrate PayPal Buttons
- Use client-side Supabase for real-time features

### Server Components
- Fetch data on server (SSR)
- No client-side JavaScript bundle
- Direct database queries
- Better SEO and performance
- Create PayPal orders

### Supabase Clients
- **server.ts**: For Server Components (service role)
- **client.ts**: For Client Components (user auth)
- **admin.ts**: For admin operations (service role)

### PayPal Integration
- **server.ts**: Server-side order creation and capture
- **client.ts**: Client-side PayPal SDK configuration
- **PaymentForm**: React component for PayPal buttons

## 🔐 Authentication Strategy

### Public Users (Customers)
- **Type**: Anonymous/guest users
- **Access**: Browse products, add to cart, checkout
- **Identification**: Email in orders table
- **Permissions**: Insert orders, read own orders

### Admin Users
- **Type**: Password-based authentication
- **Access**: Full admin panel
- **Implementation**: Simple password hash in env var
- **Session**: HTTP-only cookie
- **Permissions**: Full CRUD on all tables

## 💾 State Management

### Zustand Store (`store/cartStore.ts`)
```typescript
interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}
```

- **Persistence**: LocalStorage with Zustand middleware
- **Hydration**: Client-side only to prevent SSR mismatch
- **Validation**: Stock checking before adding items

## 🌍 Internationalization (i18n)

### Custom Lightweight System
- **Implementation**: Simple `t(key)` function
- **Configuration**: `NEXT_PUBLIC_LOCALE` environment variable
- **Languages**: English (en), Spanish (es), Portuguese (pt)
- **Structure**: Hierarchical keys (`common.`, `products.`, `cart.`, `categories.`)
- **Category Translation**: Map-based system in FilterButtons:
  ```typescript
  const CATEGORY_MAP: Record<string, string> = {
    'Electronics': 'categories.electronics',
    'Clothing': 'categories.clothing',
    // ...
  }
  ```

### Usage Example
```typescript
import { t } from '@/lib/i18n'

// In component
<button>{t('products.addToCart')}</button>
// Returns: "Add to Cart" (en) | "Agregar al Carrito" (es) | "Adicionar ao Carrinho" (pt)
```

## 🔒 Security Considerations

### Row Level Security (RLS)
- **Products**: Public read, admin write
- **Orders**: Users read own, anonymous insert, admin all
- **OrderItems**: Users read via order ownership, admin all

### API Route Protection
- **Admin routes**: Protected by middleware
- **Payment routes**: Server-side validation only
- **Webhook routes**: Signature verification required

### Data Validation
- **Client-side**: Zod schemas for forms
- **Server-side**: Zod validation + database constraints
- **Never trust client**: Prices fetched server-side for payments

## ⚠️ Known Technical Issues

### TypeScript Type Inconsistencies
The project currently has type definition issues that need resolution:

1. **Database Schema Mismatch**: 
   - `orders` table uses `paypal_order_id` (string, unique, not null)
   - Type definitions still reference `stripe_payment_id: string | null`
   - **Location**: `types/models.ts` line 35

2. **Supabase Generated Types**: 
   - May need regeneration after database schema changes
   - **Location**: `types/database.ts`

3. **Admin Email Utilities**:
   - Type errors in `lib/email/admin.ts`
   - Missing proper type definitions for email functions

### Temporary Workarounds
```typescript
// Use type assertions where necessary
const order = orderData as any

// Or ignore specific lines
// @ts-ignore
```

### Permanent Solutions Required
1. Update `types/models.ts` to match actual database schema
2. Regenerate Supabase types: `npx supabase gen types typescript --project-id your-project-id > types/database.ts`
3. Fix email utility type definitions
4. Add proper error handling for type-safe operations

## 📊 Performance Optimizations

### Image Optimization
- **Next.js Image**: Automatic optimization
- **Supabase Storage**: CDN delivery
- **Responsive**: Multiple sizes generated

### Caching Strategy
- **Static pages**: ISR with 1-hour revalidation
- **Product catalog**: Server-side fetch (fresh data)
- **Admin pages**: Dynamic (no cache)

### Database Optimization
- **Indexes**: On foreign keys and query patterns
- **Selective queries**: Specific columns only
- **Pagination**: For large datasets

## 🎯 Design Principles

1. **Separation of Concerns**: Clear boundaries between client/server
2. **Type Safety**: Full TypeScript coverage (with known issues to fix)
3. **Accessibility**: ARIA labels, keyboard navigation
4. **Mobile-First**: Responsive design approach
5. **Performance**: Minimal JavaScript, server-side rendering
6. **Security**: RLS, input validation, secure defaults

## 🚀 Current Implementation Status

### ✅ Fully Implemented
- Product catalog with filtering and search
- Shopping cart with persistent state
- PayPal payment integration
- Multi-language support (EN, ES, PT)
- Admin panel for product/order management
- Email notifications
- Responsive design

### ⚠️ Partially Implemented
- TypeScript type safety (has inconsistencies)
- Webhook signature verification (needs completion)
- Error handling (some edge cases missing)

### ❌ Not Yet Implemented
- Production PayPal configuration
- Advanced analytics
- Inventory management alerts
- Customer accounts
- Advanced shipping options