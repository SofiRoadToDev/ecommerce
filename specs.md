# 🛒 Project Specifications: Production-Ready E-commerce Platform

## 1. Project Overview
A complete, production-ready e-commerce platform designed for small businesses. Enables selling digital or physical products with frictionless checkout, automated inventory management, email notifications, and an admin panel for autonomous operation.

**Target Deployment:** Netlify (Free Tier).
**Target Database:** Supabase (Free Tier).
**Target Market:** Small businesses requiring full autonomy without technical knowledge.

---

## 2. Tech Stack (Exact Versions)

### Core Framework
* **Next.js:** `15.1.0` (App Router, React Server Components)
* **React:** `18.3.1`
* **TypeScript:** `5.3.3` (Strict mode enabled)
* **Node.js:** `>=18.17.0` (LTS)

### Styling & UI
* **Tailwind CSS:** `3.4.1` (Mobile-first, JIT mode)
* **PostCSS:** `8.4.33`
* **Autoprefixer:** `10.4.17`
* **Lucide React:** `0.314.0` (Icon library)
* **Headless UI:** `1.7.18` (Accessible UI primitives for dialogs, dropdowns)

### State Management & Forms
* **Zustand:** `4.5.0` (Cart state management)
* **React Hook Form:** `7.49.3` (Form management)
* **Zod:** `3.22.4` (Schema validation)

### Backend & Database
* **Supabase JS:** `2.39.3` (PostgreSQL client + Auth + Storage)
* **@supabase/ssr:** `0.1.0` (Server-side helpers for Next.js)

### Payments
* **Stripe (server):** `14.14.0` (Node.js SDK)
* **@stripe/stripe-js:** `3.0.1` (Client-side)
* **@stripe/react-stripe-js:** `2.5.0` (React Elements)

### Email
* **Resend:** `3.2.0` (Transactional emails)

### Dev Dependencies
* **@types/node:** `20.11.5`
* **@types/react:** `18.2.48`
* **@types/react-dom:** `18.2.18`
* **eslint:** `8.56.0`
* **eslint-config-next:** `15.1.0`

---

## 2.5. Internationalization (i18n)

### Strategy
Simple, lightweight custom i18n system (no external libraries needed).

### Supported Languages
- **English** (en) - Default
- **Spanish** (es)
- **Portuguese** (pt)

### Implementation
```typescript
// lib/i18n/translations.ts
export const translations = {
  en: { /* English translations */ },
  es: { /* Spanish translations */ },
  pt: { /* Portuguese translations */ }
}

// lib/i18n/index.ts
export function t(key: string): string {
  const locale = process.env.NEXT_PUBLIC_LOCALE || 'en'
  return translations[locale][key] || key
}
```

### Environment Variable
```bash
NEXT_PUBLIC_LOCALE=en  # Options: en, es, pt
```

### Translation Keys Structure
```typescript
{
  // Common
  "common.loading": "Loading...",
  "common.error": "An error occurred",
  "common.retry": "Retry",

  // Products
  "products.addToCart": "Add to Cart",
  "products.outOfStock": "Out of Stock",
  "products.inStock": "In stock",

  // Cart
  "cart.title": "Shopping Cart",
  "cart.empty": "Your cart is empty",
  "cart.checkout": "Proceed to Checkout",

  // Checkout
  "checkout.title": "Checkout",
  "checkout.shipping": "Shipping Information",
  // ... etc
}
```

---

## 3. Project Architecture

### Folder Structure (Ecosystemic Design)
```
ecommerce/
├── app/
│   ├── (public)/              # Public route group
│   │   ├── page.tsx           # Product catalog (home)
│   │   ├── layout.tsx         # Public layout
│   │   └── checkout/
│   │       ├── page.tsx       # Checkout form
│   │       └── success/page.tsx
│   ├── admin/                 # Admin route group (protected)
│   │   ├── layout.tsx         # Admin layout (sidebar, nav)
│   │   ├── dashboard/page.tsx # Stats overview
│   │   ├── products/
│   │   │   ├── page.tsx       # Product list
│   │   │   ├── new/page.tsx   # Create product
│   │   │   └── [id]/edit/page.tsx
│   │   └── orders/
│   │       ├── page.tsx       # Order list
│   │       └── [id]/page.tsx  # Order details
│   └── api/
│       ├── auth/
│       │   └── admin/route.ts # Admin login API
│       ├── create-payment-intent/route.ts
│       ├── send-order-email/route.ts
│       └── webhooks/
│           └── stripe/route.ts
├── components/
│   ├── ui/                    # Reusable UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── table.tsx
│   ├── public/                # Public-facing components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductSkeleton.tsx
│   │   └── CartSheet.tsx
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
│   ├── stripe.ts              # Stripe initialization
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
├── .env.local                 # Environment variables (gitignored)
├── .env.example               # Template
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Design Principles
1. **Route Grouping:** `(public)` vs `admin` for clear separation
2. **Component Organization:** By domain (public/admin) + reusable UI primitives
3. **Type Safety:** Shared types in `/types`, validated with Zod
4. **Server/Client Separation:** Clear distinction in Supabase clients
5. **API Routes:** RESTful, protected with middleware when needed
6. **Consistent Error Handling:** Unified error responses across API routes
7. **Loading States:** Consistent skeleton patterns

---

## 3.5. Design System & UI/UX Guidelines

### Philosophy
**Modern, minimalist, and conversion-focused.** Inspired by: Vercel, Stripe, Linear, shadcn/ui.

### Design Principles
- **Clarity over cleverness** - Simple, obvious interactions
- **Whitespace is king** - Generous spacing, never cramped
- **Mobile-first** - Design for small screens, enhance for large
- **Tailwind only** - Zero custom CSS files, all styling via Tailwind classes
- **Dark mode ready** - Use Tailwind's dark mode utilities (optional for Phase 1)

---

### Color Palette (Tailwind Classes)

#### Primary Colors
```css
/* Main brand color - Use for CTAs, links, active states */
bg-blue-600 hover:bg-blue-700
text-blue-600
border-blue-600

/* Darker variant for depth */
bg-blue-700
```

#### Neutral Colors
```css
/* Backgrounds */
bg-white          /* Main background */
bg-gray-50        /* Subtle backgrounds (cards, sections) */
bg-gray-100       /* Hover states, disabled fields */

/* Text */
text-gray-900     /* Primary text */
text-gray-600     /* Secondary text */
text-gray-400     /* Muted text, placeholders */

/* Borders */
border-gray-200   /* Subtle borders */
border-gray-300   /* Prominent borders */
```

#### Semantic Colors
```css
/* Success (payment confirmed, stock available) */
bg-green-50 text-green-700 border-green-200

/* Warning (low stock) */
bg-yellow-50 text-yellow-700 border-yellow-200

/* Error (out of stock, payment failed) */
bg-red-50 text-red-700 border-red-200

/* Info */
bg-blue-50 text-blue-700 border-blue-200
```

#### Admin Panel Colors
```css
/* Sidebar */
bg-gray-900 text-gray-100

/* Active nav item */
bg-gray-800 text-white

/* Dashboard cards */
bg-white border border-gray-200 shadow-sm
```

---

### Typography

#### Font Stack
```javascript
// tailwind.config.ts
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
}
```
*Note: Use next/font to load Inter font*

#### Text Scale
```css
/* Headings */
text-4xl font-bold tracking-tight     /* H1 - Page titles */
text-3xl font-bold tracking-tight     /* H2 - Section titles */
text-2xl font-semibold                /* H3 - Card titles */
text-xl font-semibold                 /* H4 - Subsections */

/* Body */
text-base text-gray-900               /* Primary text */
text-sm text-gray-600                 /* Secondary text, labels */
text-xs text-gray-500                 /* Captions, helper text */

/* Special */
text-sm font-medium                   /* Buttons, badges */
text-2xl font-bold                    /* Prices */
```

---

### Spacing & Layout

#### Container
```css
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

#### Section Spacing
```css
py-12 sm:py-16 lg:py-20               /* Between major sections */
space-y-8                             /* Between elements in a section */
```

#### Component Spacing
```css
gap-6                                 /* Grid gaps */
space-y-4                             /* Stacked elements */
p-6                                   /* Card padding */
p-4 sm:p-6                            /* Responsive padding */
```

---

### Component Patterns

#### Buttons
```tsx
// Primary Button
<button className="
  bg-blue-600 hover:bg-blue-700
  text-white font-medium
  px-6 py-2.5
  rounded-lg
  transition-colors
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Add to Cart
</button>

// Secondary Button
<button className="
  bg-white hover:bg-gray-50
  text-gray-900 font-medium
  px-6 py-2.5
  border border-gray-300
  rounded-lg
  transition-colors
">
  Cancel
</button>

// Ghost Button (for less prominent actions)
<button className="
  text-gray-600 hover:text-gray-900
  font-medium
  px-4 py-2
  rounded-lg
  hover:bg-gray-100
  transition-colors
">
  Learn More
</button>
```

#### Cards
```tsx
<div className="
  bg-white
  border border-gray-200
  rounded-xl
  p-6
  shadow-sm hover:shadow-md
  transition-shadow
">
  {/* Card content */}
</div>
```

#### Input Fields
```tsx
<input className="
  w-full
  px-4 py-2.5
  border border-gray-300
  rounded-lg
  text-gray-900
  placeholder:text-gray-400
  focus:ring-2 focus:ring-blue-500 focus:border-transparent
  transition-all
" />

// With error state
<input className="
  border-red-300 focus:ring-red-500
" />
```

#### Badges
```tsx
// Out of Stock
<span className="
  inline-flex items-center
  px-2.5 py-0.5
  rounded-full
  text-xs font-medium
  bg-red-50 text-red-700 border border-red-200
">
  Out of Stock
</span>

// In Stock
<span className="
  bg-green-50 text-green-700 border border-green-200
  ...
">
  In Stock
</span>
```

#### Skeleton Loaders
```tsx
<div className="animate-pulse">
  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

---

### Page-Specific Patterns

#### Product Grid (Home)
```tsx
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-6
">
  {/* Product cards */}
</div>
```

#### Product Card
```tsx
<div className="group">
  {/* Image container with hover effect */}
  <div className="
    aspect-square
    relative
    overflow-hidden
    rounded-xl
    mb-4
    bg-gray-100
  ">
    <Image
      className="
        object-cover
        group-hover:scale-105
        transition-transform
        duration-300
      "
      fill
      src={product.image_url}
      alt={product.title}
    />
  </div>

  {/* Product info */}
  <div className="space-y-2">
    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
      {product.title}
    </h3>
    <p className="text-lg font-bold text-gray-900">
      {formatPrice(product.price)}
    </p>
  </div>

  {/* Add to cart button */}
  <button className="w-full mt-4 ...">
    Add to Cart
  </button>
</div>
```

#### Checkout Split Layout
```tsx
<div className="
  min-h-screen
  bg-gray-50
">
  <div className="
    max-w-7xl mx-auto
    px-4 py-12
  ">
    <div className="
      grid
      lg:grid-cols-2
      gap-8 lg:gap-12
    ">
      {/* Left: Form */}
      <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm">
        {/* Form fields */}
      </div>

      {/* Right: Summary */}
      <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm">
        {/* Order summary */}
      </div>
    </div>
  </div>
</div>
```

#### Admin Sidebar Layout
```tsx
<div className="flex h-screen bg-gray-100">
  {/* Sidebar */}
  <aside className="
    w-64
    bg-gray-900
    text-white
    flex flex-col
  ">
    {/* Logo */}
    <div className="p-6 border-b border-gray-800">
      <h1 className="text-xl font-bold">Admin Panel</h1>
    </div>

    {/* Nav links */}
    <nav className="flex-1 p-4 space-y-2">
      <a className="
        flex items-center gap-3
        px-4 py-2.5
        rounded-lg
        text-gray-300 hover:text-white
        hover:bg-gray-800
        transition-colors
      ">
        <Icon /> Dashboard
      </a>
    </nav>
  </aside>

  {/* Main content */}
  <main className="flex-1 overflow-auto">
    <div className="p-8">
      {/* Page content */}
    </div>
  </main>
</div>
```

---

### Animations & Transitions

```css
/* Hover effects */
transition-colors         /* For background/text color changes */
transition-transform      /* For scale/translate effects */
transition-shadow         /* For shadow changes */
transition-all            /* For multiple properties (use sparingly) */

/* Durations (Tailwind default is 150ms) */
duration-200              /* Snappy interactions */
duration-300              /* Smooth transitions */

/* Skeleton loading */
animate-pulse

/* Smooth entrance */
animate-in fade-in slide-in-from-bottom-4 duration-300
```

---

### Responsive Design Breakpoints

```css
/* Mobile first approach */
sm:   640px   /* Small tablets */
md:   768px   /* Tablets */
lg:   1024px  /* Laptops */
xl:   1280px  /* Desktops */
2xl:  1536px  /* Large desktops */
```

#### Example Responsive Pattern
```tsx
<div className="
  text-2xl         /* Mobile: 24px */
  sm:text-3xl      /* Tablet: 30px */
  lg:text-4xl      /* Desktop: 36px */

  px-4             /* Mobile: 16px padding */
  sm:px-6          /* Tablet: 24px padding */
  lg:px-8          /* Desktop: 32px padding */
">
```

---

### Icons

**Library:** Lucide React 0.314.0

```tsx
import { ShoppingCart, Plus, Trash2, Check } from 'lucide-react'

// Standard size
<ShoppingCart className="w-5 h-5" />

// Large (for empty states)
<ShoppingCart className="w-12 h-12 text-gray-400" />

// With button
<button className="flex items-center gap-2">
  <Plus className="w-4 h-4" />
  Add Product
</button>
```

**Common icons needed:**
- `ShoppingCart` - Cart icon
- `Plus` / `Minus` - Quantity controls
- `Trash2` - Delete actions
- `Check` - Success states
- `X` - Close modals
- `Search` - Search functionality
- `Filter` - Filter controls
- `Package` - Orders
- `Tag` - Products
- `BarChart3` - Dashboard stats
- `LogOut` - Logout

---

### Accessibility Guidelines

```tsx
// Buttons always have visible text or aria-label
<button aria-label="Add to cart">
  <Plus className="w-5 h-5" />
</button>

// Form inputs always have labels
<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
  Email
</label>
<input id="email" type="email" ... />

// Focus states are visible
focus:ring-2 focus:ring-blue-500 focus:ring-offset-2

// Color is not the only indicator
<span className="text-red-600 flex items-center gap-1">
  <AlertCircle className="w-4 h-4" />
  Out of Stock
</span>
```

---

### Performance Guidelines

1. **Images:** Always use `next/image` with proper sizing
2. **Lazy loading:** Images below fold automatically lazy-load
3. **Fonts:** Load via `next/font` for optimization
4. **Critical CSS:** Tailwind purges unused classes automatically
5. **No custom CSS files:** Everything via Tailwind to leverage JIT

---

### Examples of What NOT to Do

❌ **Don't use inline styles**
```tsx
<div style={{ marginTop: '20px', color: '#333' }}>
```

❌ **Don't create separate CSS files**
```tsx
// ❌ No styles.css or module.css files
import './ProductCard.css'
```

❌ **Don't use arbitrary values excessively**
```tsx
<div className="mt-[17px] text-[#a3c5f2]">
```

❌ **Don't mix design patterns**
```tsx
// ❌ Inconsistent button styles
<button className="bg-blue-500 ...">Button 1</button>
<button className="bg-indigo-600 ...">Button 2</button>
```

✅ **Do create reusable UI components**
```tsx
// components/ui/button.tsx
export function Button({ variant = 'primary', ... }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
  }
  return <button className={`${variants[variant]} px-6 py-2.5 rounded-lg ...`} />
}
```

---

## 4. Core Features Scope

### A. Product Catalog (Public)
* **Fetch:** Server-side rendering from Supabase
* **Filtering:** Category filter with URL search params
* **UI:** Responsive grid (1/2/3/4 columns based on viewport)
* **Interactions:** Add to cart, stock indicator, out-of-stock handling
* **Images:** Optimized with `next/image`

### B. Shopping Cart
* **Type:** Slide-over drawer (Headless UI Dialog)
* **Persistence:** LocalStorage with Zustand middleware
* **Actions:** Add, remove, update quantity (with stock validation)
* **Calculation:** Real-time subtotal/total updates

### C. Checkout & Payments
* **Layout:** Split screen (form left, summary right)
* **Flow:**
  1. User fills shipping info (validated with Zod)
  2. API route validates stock + creates PaymentIntent
  3. User enters card via Stripe Elements
  4. Webhook confirms payment → creates order → decrements stock → sends email
* **Cross-selling:** Related products in checkout summary

### D. Email Notifications (Automated)
* **Service:** Resend API
* **Triggers:**
  - Order confirmed (from webhook)
  - Status changes (via PostgreSQL trigger)
* **Templates:** 4 HTML templates (confirmed, processing, shipped, ready)

### E. Admin Panel (Protected)
* **Authentication:** Simple password-based or Supabase Auth
* **Product Management:**
  - List all products (table with search/filter)
  - Create/Edit/Delete products
  - Image upload to Supabase Storage
  - Stock management
* **Order Management:**
  - List all orders (filter by status, date, customer)
  - View order details (items, customer info, payment ID)
  - Update order status (triggers email automatically)
* **Dashboard:**
  - Total sales (sum of paid orders)
  - Pending orders count
  - Low stock alerts

---

## 5. Database Schema (Supabase PostgreSQL)

### Table: `products`
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)
);
```

**Indexes:**
```sql
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_stock ON products(stock) WHERE stock > 0;
```

**RLS Policies:**
- Public: SELECT (read-only)
- Admin: ALL (via service role key)

### Table: `orders`
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  shipping_address JSONB NOT NULL, -- {address, city, postal_code, country}
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'ready_for_pickup', 'completed')),
  stripe_payment_id TEXT UNIQUE
);
```

**Indexes:**
```sql
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

**RLS Policies:**
- Anonymous: INSERT (for creating orders)
- Users: SELECT WHERE customer_email = auth.email()
- Admin: ALL (via service role key)

### Table: `order_items`
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase NUMERIC(10, 2) NOT NULL
);
```

**Indexes:**
```sql
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
```

**RLS Policies:**
- Users: SELECT via orders.customer_email JOIN
- Admin: ALL (via service role key)

### Supabase Storage Bucket: `product-images`
```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- RLS Policy: Public read
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- RLS Policy: Admin upload/delete (authenticated users only)
CREATE POLICY "Admin upload access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admin delete access"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
```

### Stored Procedures

#### Decrement Stock (Atomic)
```sql
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = stock - p_quantity
  WHERE id = p_product_id AND stock >= p_quantity;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', p_product_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Order Status Change Trigger
```sql
CREATE EXTENSION IF NOT EXISTS http;

CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT := current_setting('app.webhook_url', true);
  secret TEXT := current_setting('app.webhook_secret', true);
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status != 'pending' THEN
    PERFORM net.http_post(
      url := webhook_url || '/api/send-order-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'X-Secret', secret
      ),
      body := jsonb_build_object(
        'order_id', NEW.id,
        'status', NEW.status,
        'customer_email', NEW.customer_email,
        'customer_name', NEW.customer_name,
        'total_amount', NEW.total_amount
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_status_update
AFTER UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION notify_order_status_change();
```

---

## 6. Authentication Strategy

### Admin Access (Simple & Secure)
**Option A: Password-based (Recommended for MVP)**
- Single admin password stored in `ADMIN_PASSWORD` env var (hashed with bcrypt)
- Middleware protects `/admin/*` routes
- Session stored in HTTP-only cookie (iron-session or similar)

**Option B: Supabase Auth (For multi-admin)**
- Use Supabase built-in auth
- RLS policies based on `auth.uid()`
- Admin role stored in `profiles` table

**Chosen for this spec:** Option A (simpler, less overhead)

---

## 7. API Design Patterns

### Response Format (Consistent)
```typescript
// Success
{
  success: true,
  data: { ... }
}

// Error
{
  success: false,
  error: {
    code: 'INSUFFICIENT_STOCK',
    message: 'Product "X" only has 2 items in stock',
    details?: { ... }
  }
}
```

### Authentication Header (Admin APIs)
```
Authorization: Bearer <session_token>
```

### Webhook Security
- Stripe: Verify signature with `stripe.webhooks.constructEvent()`
- Internal: Shared secret in `X-Secret` header

---

## 8. Environment Variables

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=https://yourstore.com
NEXT_PUBLIC_LOCALE=en  # Options: en (English), es (Spanish), pt (Portuguese)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # For admin operations

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Resend
RESEND_API_KEY=re_xxx

# Admin
ADMIN_PASSWORD_HASH=<bcrypt_hash>  # For admin auth
EMAIL_WEBHOOK_SECRET=<random_secret>  # For order status emails

# Supabase Settings (for trigger function)
# Set in Supabase Dashboard → Settings → Custom Config
app.webhook_url=https://yourstore.com
app.webhook_secret=<email_webhook_secret>
```

---

## 9. Performance & Optimization

### Image Optimization
- Use `next/image` with `loader="default"` for Supabase Storage
- Recommended sizes: 600x600px for products
- Formats: WebP preferred, fallback to JPEG

### Caching Strategy
- Static pages: ISR with `revalidate: 3600` (1 hour) for product catalog
- Admin pages: `dynamic` (no cache)
- API routes: No cache (real-time data)

### Database Optimization
- Indexes on foreign keys and frequently queried columns
- Use `select('*')` sparingly; specify columns
- Limit results with `.limit()` for lists

---

## 10. Security Checklist

✅ RLS enabled on all tables
✅ API routes validate input with Zod
✅ Stripe webhook signature verification
✅ Admin routes protected with middleware
✅ No sensitive data in client-side code
✅ HTTPS only in production
✅ CORS configured for API routes
✅ Rate limiting on Netlify edge functions (built-in)
✅ SQL injection prevention (parameterized queries via Supabase)
✅ XSS prevention (React escapes by default)

---

## 11. Deployment Checklist

### Netlify Configuration
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `18.x` or higher
- Environment variables: Set in Netlify dashboard

### Supabase Configuration
1. Run all SQL migrations
2. Enable RLS on all tables
3. Create storage bucket
4. Enable `http` extension
5. Set custom config for webhook URL

### Stripe Configuration
1. Add webhook endpoint in dashboard
2. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
3. Copy signing secret

### Post-Deployment
1. Test complete checkout flow
2. Verify webhook delivery in Stripe dashboard
3. Test email delivery
4. Test admin login
5. Create first real product via admin panel

---

## 12. Future Enhancements (Upsell Opportunities)

### Phase 2 Features
- Product variants (size, color)
- Multiple images per product with gallery
- Customer reviews and ratings
- Discount codes system
- Abandoned cart recovery

### Phase 3 Features
- Customer accounts with order history
- Wishlist functionality
- Advanced analytics dashboard
- Multi-admin with roles
- Export orders to CSV
- Inventory alerts (low stock notifications)
- Multi-currency support

---

**Document Version:** 2.0
**Last Updated:** January 2025
**Status:** Production-Ready Specification
