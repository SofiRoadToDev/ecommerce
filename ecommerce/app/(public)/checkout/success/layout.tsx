import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Successful',
  description: 'Your order has been placed successfully. Thank you for shopping with us!',
  robots: {
    index: false, // Don't index success pages
    follow: false,
  },
}

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
