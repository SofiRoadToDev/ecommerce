'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Edit2, Trash2, AlertTriangle, Search } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Product } from '@/types/models'

interface ProductTableProps {
  products: Product[]
  onDelete: (productId: string) => Promise<void>
}

export function ProductTable({ products, onDelete }: ProductTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean
    product: Product | null
  }>({ open: false, product: null })
  const [deleting, setDeleting] = useState(false)

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category))
    return Array.from(cats).sort()
  }, [products])

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        categoryFilter === 'all' || product.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, categoryFilter])

  const handleDeleteClick = (product: Product) => {
    setDeleteConfirm({ open: true, product })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.product) return

    setDeleting(true)
    try {
      await onDelete(deleteConfirm.product.id)
      setDeleteConfirm({ open: false, product: null })
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, product: null })
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-600">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Products Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.length === 0 ? (
            <TableEmpty message="No products found" colSpan={6} />
          ) : (
            filteredProducts.map((product) => (
              <TableRow key={product.id}>
                {/* Image */}
                <TableCell>
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Title */}
                <TableCell>
                  <div className="max-w-xs">
                    <p className="font-medium text-gray-900 truncate">
                      {product.title}
                    </p>
                    {product.description && (
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {product.description}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </TableCell>

                {/* Price */}
                <TableCell>
                  <span className="font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                </TableCell>

                {/* Stock */}
                <TableCell>
                  <span className={`font-medium ${
                    product.stock < 5 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {product.stock}
                  </span>
                  {product.stock < 5 && (
                    <span className="ml-2 text-xs text-red-600">Low</span>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.open && deleteConfirm.product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleDeleteCancel}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Product
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to delete{' '}
                  <strong>{deleteConfirm.product.title}</strong>? This action
                  cannot be undone.
                </p>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="secondary"
                    onClick={handleDeleteCancel}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
