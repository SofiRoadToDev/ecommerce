/**
 * PayPal client configuration for client-side
 * Used by PayPalScriptProvider
 */

export function getPayPalClientId(): string {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    throw new Error('NEXT_PUBLIC_PAYPAL_CLIENT_ID is not configured');
  }

  return clientId;
}

export const paypalOptions = {
  clientId: getPayPalClientId(),
  currency: 'USD',
  intent: 'capture',
};
