import { Navbar } from "@/components/public/Navbar"
import { Footer } from "@/components/public/Footer"
import { StoreHydration } from "@/components/providers/StoreHydration"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <StoreHydration />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  )
}
