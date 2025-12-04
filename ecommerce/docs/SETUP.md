# 🚀 Setup Guide

Complete step-by-step instructions to set up the e-commerce platform from scratch.

## 📋 Prerequisites

### Required Software
- **Node.js**: >=18.17.0 (LTS version recommended)
- **npm**: Latest version (comes with Node.js)
- **Git**: For version control

### Required Accounts (Free Tiers)
- **Supabase**: [https://supabase.com](https://supabase.com) - Database + Storage
- **Stripe**: [https://stripe.com](https://stripe.com) - Payment processing
- **Resend**: [https://resend.com](https://resend.com) - Email service

### Recommended Tools
- **Stripe CLI**: For local webhook testing
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

### 6. Create Stripe Account

#### a. Create Account
1. Go to [https://stripe.com](https://stripe.com)
2. Complete business setup
3. Go to Developers → API keys
4. Copy:
   - Publishable key (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
   - Secret key (`STRIPE_SECRET_KEY`)

#### b. Configure Payment Methods
1. Go to Settings → Payment methods
2. Enable: Credit/Debit Cards
3. Configure: Automatic payment methods for PaymentIntents

#### c. Install Stripe CLI (Optional but Recommended)
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public/gpg.key | sudo apt-key add -
echo "deb https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe

# Verify installation
stripe --version
```

### 7. Create Resend Account

#### a. Sign Up
1. Go to [https://resend.com](https://resend.com)
2. Complete setup
3. Go to API Keys
4. Create new API key
5. Copy key to `RESEND_API_KEY`

#### b. Verify Domain (Production)
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

#### b. Set Custom Config
1. Go to Settings → Custom Config
2. Add:
```
app.webhook_url = http://localhost:3000
app.webhook_secret = your-email-webhook-secret
```

### 9. Set Up Stripe Webhooks (Local Development)

#### a. Install Stripe CLI (if not done)
See step 6b above.

#### b. Login to Stripe CLI
```bash
stripe login
```

#### c. Forward Webhooks
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

#### d. Save Webhook Secret
Copy the webhook secret output and add to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### 10. Start Development Server

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

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Resend
RESEND_API_KEY=re_xxx

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

### 3. Stripe Integration
```bash
# Test payment creation
curl -X POST http://localhost:3000/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"items":[{"id":"product-id","quantity":1}],"customer":{"email":"test@example.com","name":"Test User","address":"123 Main St","city":"New York","postalCode":"10001","country":"US"}}'

# Test with Stripe CLI
stripe trigger payment_intent.succeeded
```

**Test Cards:**
- ✅ Success: `4242 4242 4242 4242`
- ❌ Declined: `4000 0000 0000 0002`
- 🔄 3D Secure: `4000 0025 0000 3155`

### 4. Email Service
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

### Issue: "Webhook not working"
**Solution:**
- Check Stripe webhook secret is correct
- Verify webhook URL is accessible
- Check server logs for errors
- Ensure raw body is preserved

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

## 🚀 Next Steps

After successful setup:

1. **Start Development**: Begin building Phase 2 features
2. **Customize Products**: Add your own products via SQL or admin panel (Phase 12)
3. **Configure Payments**: Set up Stripe for production
4. **Customize Emails**: Modify email templates
5. **Deploy**: Follow deployment guide in Phase 10

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
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
- [ ] Stripe webhooks are configured
- [ ] Email service is connected
- [ ] Admin password is set
- [ ] Storage bucket is created
- [ ] RLS policies are enabled
- [ ] Extensions are installed