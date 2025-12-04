# 🚀 Setup Guide

Complete step-by-step instructions to set up the e-commerce platform.

## 📋 Prerequisites

### Required Software
- **Node.js**: >=18.17.0 (LTS version recommended)
- **npm**: Latest version (comes with Node.js)
- **Git**: For version control

### Required Accounts (Free Tiers)
- **Supabase**: [https://supabase.com](https://supabase.com) - Database + Storage
- **PayPal**: [https://developer.paypal.com](https://developer.paypal.com) - Payment processing
- **Resend**: [https://resend.com](https://resend.com) - Email service

### Recommended Tools
- **VS Code**: With TypeScript extension

## 🛠️ Step-by-Step Setup

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd ecommerce
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Supabase Project

#### a. Create Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization (or create new)
4. Project name: `ecommerce-store`
5. Database password: Generate strong password
6. Region: Choose closest to your users
7. Click "Create new project"

#### b. Wait for Setup
- Takes ~2 minutes to provision
- Save your project URL and API keys

### 4. Configure Database

#### a. Get Connection Details
1. Go to Project Settings → Database
2. Copy connection string (for direct access if needed)
3. Go to Settings → API
4. Copy:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - Anon key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Service role key (`SUPABASE_SERVICE_ROLE_KEY`)

#### b. Run SQL Setup Script
1. Go to SQL Editor in Supabase Dashboard
2. Click "New query"
3. Copy contents of `supabase-setup.sql`
4. Paste and click "Run"
5. Verify all tables created successfully

#### c. Verify Setup
Run these queries to verify:
```sql
-- Check tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS policies
SELECT schemaname, tablename, policyname FROM pg_policies;

-- Check storage bucket
SELECT * FROM storage.buckets;
```

### 5. Set Up Environment Variables

#### a. Copy Environment File
```bash
cp .env.example .env.local
```

#### b. Configure Supabase Variables
```bash
# From your Supabase project
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### c. Set Application URL
```bash
# For local development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_LOCALE=en
```

#### d. Generate Admin Password
```bash
# Generate a strong password for admin access
# You'll need to hash it for production
ADMIN_PASSWORD_HASH=your-secure-password
EMAIL_WEBHOOK_SECRET=another-secure-secret
```

### 6. Create PayPal Developer Account

#### a. Create Account
1. Go to [https://developer.paypal.com](https://developer.paypal.com)
2. Sign in with PayPal account
3. Go to My Apps & Credentials
4. Create new app: `ecommerce-store`
5. Copy:
   - Client ID (`NEXT_PUBLIC_PAYPAL_CLIENT_ID`)
   - Secret (`PAYPAL_CLIENT_SECRET`)

#### b. Create Sandbox Accounts
1. Go to Sandbox → Accounts
2. Create Business account (for receiving payments)
3. Create Personal account (for testing purchases)

#### c. Configure Webhooks
1. Go to your app → Webhooks
2. Add webhook endpoint: `https://your-domain.com/api/webhooks/paypal`
3. Subscribe to events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
4. Copy webhook ID to `PAYPAL_WEBHOOK_ID`

### 7. Create Resend Account

#### a. Sign Up
1. Go to [https://resend.com](https://resend.com)
2. Complete setup
3. Go to API Keys
4. Create new API key
5. Copy key to `RESEND_API_KEY`

#### b. Configure Email Settings
```bash
# Email configuration
FROM_EMAIL=noreply@yourstore.com
FROM_NAME=Your Store
REPLY_TO_EMAIL=support@yourstore.com
```

#### c. Verify Domain (Production)
- Add your domain in Resend
- Follow DNS verification steps
- Set as default sender

### 8. Configure Supabase Settings

#### a. Enable Extensions
1. Go to SQL Editor
2. Run:
```sql
CREATE EXTENSION IF NOT EXISTS http;
```

#### b. Set Custom Config (Optional)
1. Go to Settings → Custom Config
2. Add:
```
app.webhook_url = http://localhost:3000
app.webhook_secret = your-email-webhook-secret
```

### 9. Start Development Server

#### a. Run Development Server
```bash
npm run dev
```

#### b. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

#### c. Verify Setup
You should see:
- Basic product catalog (with placeholder images)
- No errors in browser console
- No build errors in terminal

## 🔧 Environment Variables Reference

Complete `.env.local` file:
```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_LOCALE=en  # Options: en, es, pt - Controls site language

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_WEBHOOK_ID=xxx

# Resend
RESEND_API_KEY=re_xxx
FROM_EMAIL=noreply@yourstore.com
FROM_NAME=Your Store
REPLY_TO_EMAIL=support@yourstore.com

# Admin
ADMIN_PASSWORD_HASH=your-admin-password
EMAIL_WEBHOOK_SECRET=your-email-secret
```

## 🧪 Testing the Setup

### 1. Language & i18n Testing
```bash
# Test different languages by editing .env.local:
NEXT_PUBLIC_LOCALE=es  # Spanish
# or
NEXT_PUBLIC_LOCALE=pt  # Portuguese

# Then restart and verify:
# - Navbar shows translated store name
# - Category filters show translated labels
# - All UI text appears in correct language
```

### 2. Database Connection
```bash
# Test with curl or browser
curl https://your-project.supabase.co/rest/v1/products \
  -H "apikey: your-anon-key" \
  -H "Accept: application/json"
```

### 3. PayPal Integration
```bash
# Test order creation
curl -X POST http://localhost:3000/api/create-paypal-order \
  -H "Content-Type: application/json" \
  -d '{"items":[{"id":"product-id","quantity":1}]}'
```

### 4. Test PayPal Payment Flow
1. Add products to cart
2. Proceed to checkout
3. Fill shipping information
4. Click PayPal button
5. Login with test buyer account
6. Complete payment
7. Verify order confirmation

### 5. Email Service
```bash
# Test Resend API
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer your-resend-key" \
  -H "Content-Type: application/json" \
  -d '{"from": "onboarding@resend.dev", "to": "your-email@test.com", "subject": "Test", "text": "Hello"}'
```

## 🐛 Common Issues & Troubleshooting

### Issue: "Cannot connect to database"
**Solution:**
- Check Supabase project URL and keys
- Verify project is not paused
- Check network/firewall settings

### Issue: "RLS policy violation"
**Solution:**
- Ensure RLS policies are created
- Check if tables have RLS enabled
- Verify correct auth context

### Issue: "PayPal button not loading"
**Solution:**
- Check PayPal Client ID is correct
- Verify using sandbox credentials for development
- Check browser console for JavaScript errors

### Issue: "Webhook not working"
**Solution:**
- Check PayPal webhook ID is correct
- Verify webhook URL is accessible
- Check server logs for errors
- Ensure webhook events are subscribed

### Issue: "Build fails"
**Solution:**
- Check Node.js version (>=18.17.0)
- Clear node_modules and reinstall
- Check for TypeScript errors

### Issue: "Images not loading"
**Solution:**
- Check Supabase storage bucket exists
- Verify RLS policies for storage
- Check image URLs are correct

## ⚠️ Known Issues

### TypeScript Type Errors
The project currently has some type inconsistencies that need to be addressed:

1. **Database Schema vs Type Definitions**: The `orders` table uses `paypal_order_id` but type definitions still reference `stripe_payment_id`
2. **Supabase Generated Types**: May need regeneration after database changes

**Temporary Fix:**
```bash
# Ignore type errors during development
npm run dev -- --ignore-type-errors
```

**Permanent Fix:**
Update type definitions in `types/models.ts` to match actual database schema.

## 🚀 Next Steps

After successful setup:

1. **Start Development**: Begin building additional features
2. **Customize Products**: Add your own products via SQL or admin panel
3. **Configure PayPal**: Set up PayPal for production
4. **Customize Emails**: Modify email templates
5. **Deploy**: Follow deployment guide

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PayPal Developer Documentation](https://developer.paypal.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review error logs carefully
3. Verify all environment variables
4. Test each service individually
5. Consult service documentation
6. Check GitHub issues (if applicable)

## ✅ Verification Checklist

After setup, verify:
- [ ] Development server runs without errors
- [ ] Database connection works
- [ ] Products load on home page
- [ ] Environment variables are set
- [ ] PayPal sandbox is configured
- [ ] Email service is connected
- [ ] Admin password is set
- [ ] Storage bucket is created
- [ ] RLS policies are enabled
- [ ] Extensions are installed