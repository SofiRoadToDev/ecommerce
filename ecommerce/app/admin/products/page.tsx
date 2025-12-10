import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { requireAdmin } from '@/lib/supabase/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { ProductTableClient } from '@/components/admin/ProductTableClient'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types/models'

export const dynamic = 'force-dynamic'

async function getProducts(): Promise<Product[]> {
  const supabase = createAdminClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<Product[]>()

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return products || []
}

export default async function ProductsPage() {
  // Require admin authentication
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    redirect('/admin/login')
  }

  const products = await getProducts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-600 mt-1 dark:text-gray-400">
            Manage your product inventory
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Products Table */}
      <ProductTableClient products={products} />
    </div>
  )
}
