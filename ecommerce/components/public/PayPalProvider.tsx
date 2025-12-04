'use client'

import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { paypalOptions } from '@/lib/paypal/client'

interface PayPalProviderProps {
  children: React.ReactNode
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      {children}
    </PayPalScriptProvider>
  )
}