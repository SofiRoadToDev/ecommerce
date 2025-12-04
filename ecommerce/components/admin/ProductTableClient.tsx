'use client'

import { useRouter } from 'next/navigation'
import { ProductTable } from './ProductTable'
import type { Product } from '@/types/models'

interface ProductTableClientProps {
  products: Product[]
}

export function ProductTableClient({ products }: ProductTableClientProps) {
  const router = useRouter()

  const handleDelete = async (productId: string) => {
    const response = await fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete product')
    }

    // Refresh the page to show updated list
    router.refresh()
  }

  return <ProductTable products={products} onDelete={handleDelete} />
}
