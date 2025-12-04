# 🎨 Design System & UI/UX Guidelines

## 🎯 Philosophy

**Modern, minimalist, and conversion-focused.** Inspired by industry leaders: Vercel, Stripe, Linear, shadcn/ui.

### Core Principles
- **Clarity over cleverness** - Simple, obvious interactions
- **Whitespace is king** - Generous spacing, never cramped
- **Mobile-first** - Design for small screens, enhance for large
- **Tailwind only** - Zero custom CSS files, all styling via Tailwind classes
- **Dark mode ready** - Use Tailwind's dark mode utilities (optional for Phase 1)

## 🌈 Color Palette

### Primary Colors
```css
/* Main brand color - Use for CTAs, links, active states */
bg-blue-600 hover:bg-blue-700
text-blue-600
border-blue-600

/* Darker variant for depth */
bg-blue-700
```

### Neutral Colors
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

### Semantic Colors
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

### Admin Panel Colors
```css
/* Sidebar */
bg-gray-900 text-gray-100

/* Active nav item */
bg-gray-800 text-white

/* Dashboard cards */
bg-white border border-gray-200 shadow-sm
```

## 📝 Typography

### Font Stack
```javascript
// tailwind.config.ts
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
}
```
*Note: Use next/font to load Inter font*

### Text Scale
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

## 📏 Spacing & Layout

### Container
```css
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Section Spacing
```css
py-12 sm:py-16 lg:py-20               /* Between major sections */
space-y-8                             /* Between elements in a section */
```

### Component Spacing
```css
gap-6                                 /* Grid gaps */
space-y-4                             /* Stacked elements */
p-6                                   /* Card padding */
p-4 sm:p-6                            /* Responsive padding */
```

## 🧩 Component Patterns

### Buttons

#### Primary Button
```tsx
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
```

#### Secondary Button
```tsx
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
```

#### Ghost Button
```tsx
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

### Cards
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

### Input Fields
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

### Badges

#### Out of Stock
```tsx
<span className="
  inline-flex items-center
  px-2.5 py-0.5
  rounded-full
  text-xs font-medium
  bg-red-50 text-red-700 border border-red-200
">
  Out of Stock
</span>
```

#### In Stock
```tsx
<span className="
  bg-green-50 text-green-700 border border-green-200
  ...
">
  In Stock
</span>
```

### Skeleton Loaders
```tsx
<div className="animate-pulse">
  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

## 📱 Page-Specific Patterns

### Product Grid (Home)
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

### Product Card
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

### Checkout Split Layout
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

### Admin Sidebar Layout
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

## ✨ Animations & Transitions

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

## 📱 Responsive Design Breakpoints

```css
/* Mobile first approach */
sm:   640px   /* Small tablets */
md:   768px   /* Tablets */
lg:   1024px  /* Laptops */
xl:   1280px  /* Desktops */
2xl:  1536px  /* Large desktops */
```

### Example Responsive Pattern
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

## 🎨 Icons

### Library: Lucide React 0.314.0

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

### Common Icons Needed
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

## ♿ Accessibility Guidelines

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

## ⚡ Performance Guidelines

### Image Optimization
- Always use `next/image` with proper sizing
- Recommended sizes: 600x600px for products
- Formats: WebP preferred, fallback to JPEG
- Lazy loading: Images below fold automatically lazy-load

### Caching Strategy
- Static pages: ISR with `revalidate: 3600` (1 hour) for product catalog
- Admin pages: `dynamic` (no cache)
- API routes: No cache (real-time data)

### Database Optimization
- Indexes on foreign keys and frequently queried columns
- Use `select('*')` sparingly; specify columns
- Limit results with `.limit()` for lists

## 🚫 What NOT to Do

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

## 🎯 Component Examples

### Button Component
```tsx
// components/ui/button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  children, 
  onClick, 
  disabled,
  loading 
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5',
    lg: 'px-8 py-3 text-lg'
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  )
}
```

### Card Component
```tsx
// components/ui/card.tsx
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div className={`
      bg-white
      border border-gray-200
      rounded-xl
      p-6
      ${hover ? 'shadow-sm hover:shadow-md transition-shadow' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}
```

## 📚 Summary

This design system provides:
- ✅ Consistent visual language
- ✅ Reusable component patterns
- ✅ Mobile-first approach
- ✅ Accessibility built-in
- ✅ Performance optimized
- ✅ Easy to extend and maintain

The system ensures the e-commerce platform looks professional, modern, and provides an excellent user experience across all devices.