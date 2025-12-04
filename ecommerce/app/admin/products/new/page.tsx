import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireAdmin } from '@/lib/supabase/auth'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  // Require admin authentication
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    redirect('/admin/login')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-1">
            Create a new product in your inventory
          </p>
        </div>
      </div>

      {/* Product Form */}
      <ProductForm mode="create" />
    </div>
  )
}
