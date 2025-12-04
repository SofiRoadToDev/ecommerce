# 🛒 E-commerce Platform

A production-ready e-commerce platform built with Next.js 15.1.0, designed for small businesses to sell products online with a complete admin panel for autonomous operation.

## 🚀 Tech Stack

### Core Framework
- **Next.js:** 15.1.0 (App Router, React Server Components)
- **React:** 18.3.1
- **TypeScript:** 5.3.3 (Strict mode enabled)
- **Node.js:** >=18.17.0 (LTS)

### Styling & UI
- **Tailwind CSS:** 3.4.1 (Mobile-first, JIT mode)
- **PostCSS:** 8.4.33
- **Autoprefixer:** 10.4.17
- **Lucide React:** 0.314.0 (Icon library)
- **Headless UI:** 1.7.18 (Accessible UI primitives)

### State Management & Forms
- **Zustand:** 4.5.0 (Cart state management)
- **React Hook Form:** 7.49.3 (Form management)
- **Zod:** 3.22.4 (Schema validation)

### Backend & Database
- **Supabase JS:** 2.39.3 (PostgreSQL client + Auth + Storage)
- **@supabase/ssr:** 0.1.0 (Server-side helpers for Next.js)

### Payments
- **Stripe (server):** 14.14.0 (Node.js SDK)
- **@stripe/stripe-js:** 3.0.1 (Client-side)
- **@stripe/react-stripe-js:** 2.5.0 (React Elements)

### Email
- **Resend:** 3.2.0 (Transactional emails)

## ✅ Features Implemented

### Phase 1: Project Setup & Database Connection ✅
- ✅ Next.js 15.1.0 with App Router configured
- ✅ TypeScript 5.3.3 (strict mode)
- ✅ Tailwind CSS 3.4.1 with Inter font
- ✅ Ecosystemic folder structure with route groups
- ✅ 3 Supabase clients (server, client, admin)
- ✅ Database schema (products, orders, order_items)
- ✅ RLS policies configured
- ✅ Storage bucket for product images
- ✅ Atomic stock management function
- ✅ Email notification trigger
- ✅ i18n system with 3 languages (en, es, pt)
- ✅ 10 seed products
- ✅ Type definitions (Product, Order, OrderItem, CartItem)
- ✅ Utility functions (cn, formatPrice)
- ✅ Basic home page placeholder

### Pending Implementation
- ⏳ Phase 2: Product Catalog with UI components
- ⏳ Phase 3: UI Polish & States
- ⏳ Phase 4: Shopping Cart System
- ⏳ Phase 5: Checkout Page
- ⏳ Phase 6: Stripe Payment Integration
- ⏳ Phase 7: Webhooks & Order Creation
- ⏳ Phase 8: Email System (Resend)
- ⏳ Phase 9: Automated Status Notifications
- ⏳ Phase 10: Deployment & Documentation
- ⏳ Phase 11: Admin Authentication & Layout
- ⏳ Phase 12: Product Management (CRUD)
- ⏳ Phase 13: Order Management

## 🛠️ Quick Start

### Prerequisites
- Node.js >=18.17.0
- npm or pnpm
- Supabase account (free tier)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials
   - Set other required environment variables

4. **Database Setup**
   - Create a new Supabase project
   - Run the SQL script from `supabase-setup.sql`
   - Configure storage bucket and RLS policies

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Environment Variables

See `.env.example` for the complete list of required environment variables.

Key variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - For admin operations
- `NEXT_PUBLIC_LOCALE` - Site language (en, es, pt)

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Environment Setup
- Set `NEXT_PUBLIC_APP_URL` to your production domain
- Configure Stripe webhooks
- Set Supabase custom config for email triggers

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md) - Technical architecture details
- [Database](./docs/DATABASE.md) - Database schema and relationships
- [Setup Guide](./docs/SETUP.md) - Detailed setup instructions
- [Internationalization](./docs/I18N.md) - i18n system documentation
- [Design System](./docs/DESIGN_SYSTEM.md) - UI/UX guidelines

## 📊 Project Status

**Current Phase:** 1/13 ✅ Complete  
**Next Phase:** 2 - Product Catalog  
**Estimated Completion:** 13 phases total

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Target

Designed for small businesses requiring full autonomy without technical knowledge. Zero monthly cost on free tiers until significant scale.