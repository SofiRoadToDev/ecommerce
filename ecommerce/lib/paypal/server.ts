import paypal from '@paypal/checkout-server-sdk';

/**
 * PayPal environment configuration
 * Uses Sandbox for development, Live for production
 */
function getPayPalEnvironment() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not configured');
  }

  return process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

/**
 * PayPal HTTP client for server-side operations
 */
export function getPayPalClient() {
  return new paypal.core.PayPalHttpClient(getPayPalEnvironment());
}

/**
 * Create a PayPal order
 */
export async function createPayPalOrder(amount: number, currency: string = 'USD') {
  const client = getPayPalClient();
  const request = new paypal.orders.OrdersCreateRequest();

  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
      },
    ],
  });

  try {
    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error('PayPal order creation error:', error);
    throw error;
  }
}

/**
 * Capture a PayPal order
 */
export async function capturePayPalOrder(orderId: string) {
  const client = getPayPalClient();
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error('PayPal order capture error:', error);
    throw error;
  }
}

/**
 * Get PayPal order details
 */
export async function getPayPalOrderDetails(orderId: string) {
  const client = getPayPalClient();
  const request = new paypal.orders.OrdersGetRequest(orderId);

  try {
    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error('PayPal order details error:', error);
    throw error;
  }
}
