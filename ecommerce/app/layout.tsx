import type { Metadata } from 'next'
import { inter } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'E-commerce Store - Fast & Secure Online Shopping',
    template: '%s | E-commerce Store'
  },
  description: 'Shop quality products with fast shipping. Electronics, clothing, home goods and more. Secure payments with PayPal.',
  keywords: ['online store', 'e-commerce', 'buy online', 'fast shipping', 'secure payment', 'electronics', 'clothing', 'home goods'],

  authors: [{ name: 'E-commerce Store' }],
  creator: 'E-commerce Store',
  publisher: 'E-commerce Store',

  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),

  openGraph: {
    type: 'website',
    locale: process.env.NEXT_PUBLIC_LOCALE || 'en_US',
    url: '/',
    siteName: 'E-commerce Store',
    title: 'E-commerce Store - Fast & Secure Online Shopping',
    description: 'Shop quality products with fast shipping. Electronics, clothing, home goods and more.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'E-commerce Store',
      }
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'E-commerce Store - Fast & Secure Online Shopping',
    description: 'Shop quality products with fast shipping.',
    images: ['/twitter-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
