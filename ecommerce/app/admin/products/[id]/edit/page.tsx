import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireAdmin } from '@/lib/supabase/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Product } from '@/types/models'

async function getProduct(id: string): Promise<Product | null> {
  const supabase = createAdminClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return product as Product
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Require admin authentication
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    redirect('/admin/login')
  }

  // Await params (Next.js 15 async params)
  const { id } = await params

  // Fetch product
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Update product information
          </p>
        </div>
      </div>

      {/* Product Form */}
      <ProductForm mode="edit" product={product} />
    </div>
  )
}
