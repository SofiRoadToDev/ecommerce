# 💳 PayPal Integration Documentation

## 📋 Overview

This document describes the PayPal Commerce Platform integration for the e-commerce platform. The integration follows security best practices and provides a seamless checkout experience.

## 🏗️ Architecture

### Payment Flow
```
Customer → Checkout Page → Create PayPal Order → PayPal → Webhook → Order Confirmation
   ↓           ↓                ↓                   ↓        ↓           ↓
Shipping → Payment Buttons → Server Validation → Payment → Stock → Email
Info      (PayPal SDK)     (Stock/Prices)       Result   Update  Notification
```

### Components Involved
1. **Checkout Page** (`app/(public)/checkout/page.tsx`)
2. **Payment Form** (`components/public/PaymentForm.tsx`)
3. **Create Order API** (`app/api/create-paypal-order/route.ts`)
4. **PayPal Webhook** (`app/api/webhooks/paypal/route.ts`)

## 🔧 Implementation Details

### 1. Client-Side Integration

#### PayPal Client Setup (`lib/paypal/client.ts`)
```typescript
export const paypalOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  currency: 'USD',
  intent: 'capture',
}
```

#### Payment Form Component (`components/public/PaymentForm.tsx`)
- Uses PayPal Buttons for payment
- Handles payment capture
- Shows error messages with i18n support
- Clears cart on successful payment

### 2. Server-Side Integration

#### PayPal Order Creation (`app/api/create-paypal-order/route.ts`)
```typescript
// Key security features:
1. Validates request body with Zod schema
2. Fetches real product prices from Supabase
3. Validates stock availability
4. Calculates total server-side only
5. Creates PayPal Order
6. Stores pending order data
7. Returns orderId to frontend
```

#### PayPal Server Client (`lib/paypal/server.ts`)
```typescript
// Server-side PayPal SDK integration
- getPayPalClient(): Creates authenticated client
- createPayPalOrder(): Creates order
- capturePayPalOrder(): Captures payment
- getPayPalOrderDetails(): Gets order info
```

## 🧪 Testing

### Test Accounts
1. **Create Sandbox Accounts**
   - Go to [PayPal Developer Dashboard](https://developer.paypal.com)
   - Create test Business account
   - Create test Personal account (buyer)

2. **Test Credentials**
   - Use sandbox Client ID and Secret
   - Login with test buyer account during checkout

### Testing Steps
1. **Local Development**
   ```bash
   # Test order creation
   curl -X POST http://localhost:3000/api/create-paypal-order \
     -H "Content-Type: application/json" \
     -d '{"items":[{"id":"product-id","quantity":1}]}'
   ```

2. **Browser Testing**
   - Add products to cart
   - Proceed to checkout
   - Fill shipping information
   - Click PayPal button
   - Login with test buyer account
   - Complete payment
   - Verify order confirmation

## 🔒 Security Considerations

### 1. Environment Variables
```bash
# Required for PayPal integration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_WEBHOOK_ID=xxx
```

### 2. API Route Protection
- All payment routes validate input data
- Webhook endpoints should verify PayPal signatures
- Never expose sensitive data in responses

### 3. Client-Side Security
- Use PayPal SDK for payment handling
- Never store payment details in application state
- Always use HTTPS in production

## 📊 Error Handling

### Common Errors
1. **Insufficient Stock**
   ```typescript
   if (product.stock < item.quantity) {
     return NextResponse.json(
       { error: 'Insufficient stock for product: ' + product.title },
       { status: 400 }
     )
   }
   ```

2. **Payment Failure**
   ```typescript
   onError={(err) => {
     console.error('PayPal error:', err)
     setError(t('checkout.paymentFailed'))
   }}
   ```

3. **Webhook Processing Errors**
   - Always return 200 to PayPal (even for errors)
   - Log errors for debugging
   - Implement retry logic

## 🌍 Internationalization

### Translation Keys Used
```typescript
checkout: {
  paymentDetails: "Payment Details",
  payNow: "Pay Now",
  processing: "Processing...",
  paymentFailed: "Payment failed. Please try again.",
  unexpectedError: "An unexpected error occurred",
  securePayment: "Secure payment powered by PayPal",
  total: "Total"
}
```

## 🚀 Production Deployment

### 1. PayPal Account Setup
- Create PayPal Business account
- Complete business verification
- Enable live API credentials
- Configure webhook endpoints

### 2. Environment Configuration
```bash
# Production environment variables
NEXT_PUBLIC_PAYPAL_CLIENT_ID=live_xxx
PAYPAL_CLIENT_SECRET=live_xxx
PAYPAL_WEBHOOK_ID=live_xxx
```

### 3. Webhook Configuration
- Add production webhook URL in PayPal Dashboard
- Subscribe to events:
  - PAYMENT.CAPTURE.COMPLETED
  - PAYMENT.CAPTURE.DENIED
- Test webhook endpoints before going live
- Monitor webhook delivery status

## 📈 Monitoring

### Key Metrics to Track
- Payment success rate
- Payment failure reasons
- Average transaction value
- Checkout abandonment rate
- Webhook delivery success

### Logging
```typescript
// Log important payment events
console.log('PayPal order created:', order.id)
console.log('Payment captured:', captureId)
console.log('Payment failed:', error.message)
```

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid client credentials"**
   - Verify Client ID and Secret are correct
   - Ensure using sandbox credentials for development

2. **"Webhook signature verification failed"**
   - Verify webhook ID is correct
   - Check webhook event subscription

3. **"Order not found"**
   - Ensure pending_orders table exists
   - Check database connection

4. **Build Errors**
   - Ensure PayPal dependencies are installed
   - Run `npm install`
   - Check TypeScript types

### Debug Steps
1. Check browser console for client errors
2. Review server logs for API errors
3. Verify PayPal dashboard for payment status
4. Check pending_orders table in database

## 📚 Resources

- [PayPal Developer Documentation](https://developer.paypal.com/docs)
- [PayPal React SDK](https://www.npmjs.com/package/@paypal/react-paypal-js)
- [PayPal Checkout Server SDK](https://www.npmjs.com/package/@paypal/checkout-server-sdk)
- [PayPal Webhooks](https://developer.paypal.com/api/rest/webhooks/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## ✅ Integration Checklist

- [x] PayPal Business account created
- [x] API credentials configured in environment
- [x] Create Order API route implemented
- [x] Payment Form component created
- [x] Checkout page updated with PayPal SDK
- [x] Webhook endpoint implemented
- [x] pending_orders table created
- [ ] Webhook signature verification implemented
- [ ] Translations verified for all languages
- [ ] Test accounts working in development
- [ ] Error handling tested
- [ ] Security validation in place

## 🔐 Security Implementation

### Never Trust Client Data
- Prices always fetched from database
- Stock validated before payment creation
- Total calculated server-side only
- All data validated with Zod schemas

### Pending Orders Storage
```typescript
// Store order data for webhook processing
await supabase
  .from('pending_orders')
  .insert({
    paypal_order_id: order.id,
    order_items: orderItems,
    total_amount: total,
  })
```

## 🌐 Multi-Currency Support

Currently configured for USD. To support multiple currencies:

1. Update `lib/paypal/client.ts`:
```typescript
export const paypalOptions = {
  clientId: getPayPalClientId(),
  currency: 'USD', // Change or make dynamic
  intent: 'capture',
}
```

2. Update order creation in API route:
```typescript
const order = await createPayPalOrder(total, 'EUR') // Example
```

## 🎯 Why PayPal?

PayPal was chosen for this integration because:
- **Global availability**: Works in most countries including Argentina
- **No verification barriers**: Easier account setup than Stripe
- **Buyer trust**: Well-known payment brand internationally
- **Multi-language**: Supports international audiences (EN, ES, PT)
- **Lower fees**: Competitive transaction fees
- **Fast setup**: Quick integration and deployment
