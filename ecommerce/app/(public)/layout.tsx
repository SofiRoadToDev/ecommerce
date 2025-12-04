import type { Metadata } from "next"
import { inter } from "../fonts"
import "./globals.css"
import { Navbar } from "@/components/public/Navbar"
import { Footer } from "@/components/public/Footer"
import { t } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "E-commerce Store",
  description: "Production-ready e-commerce platform",
}

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = process.env.NEXT_PUBLIC_LOCALE || 'en'
  
  return (
    <html lang={locale}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
