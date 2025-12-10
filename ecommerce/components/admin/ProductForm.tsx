'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { productFormSchema, PRODUCT_CATEGORIES, type ProductFormData } from '@/lib/validations/product'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle } from 'lucide-react'
import type { Product } from '@/types/models'

// Lazy load ImageUpload (heavy component with Supabase)
const ImageUpload = dynamic(() => import('./ImageUpload').then(mod => ({ default: mod.ImageUpload })), {
  ssr: false,
  loading: () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Image</label>
      <div className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-slate-900/50">
        <p className="text-sm text-gray-400">Loading image uploader...</p>
      </div>
    </div>
  )
})

interface ProductFormProps {
  mode: 'create' | 'edit'
  product?: Product
  onSuccess?: () => void
}

export function ProductForm({ mode, product, onSuccess }: ProductFormProps) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState(product?.image_url || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? {
      title: product.title,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image_url: product.image_url || '',
    } : {
      title: '',
      description: '',
      price: '',
      category: 'electronics',
      stock: '',
      image_url: '',
    }
  })

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      // Prepare product data
      const productData = {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        image_url: imageUrl || null,
      }

      const url = mode === 'create'
        ? '/api/admin/products'
        : `/api/admin/products/${product?.id}`

      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save product')
      }

      const result = await response.json()

      // Show success message
      setSuccessMessage(
        mode === 'create'
          ? 'Product created successfully!'
          : 'Product updated successfully!'
      )

      // Call onSuccess callback if provided
      onSuccess?.()

      // Redirect to products list after a short delay
      setTimeout(() => {
        router.push('/admin/products')
        router.refresh()
      }, 1500)

    } catch (error) {
      console.error('Error saving product:', error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUploaded = (url: string) => {
    setImageUrl(url)
  }

  const handleImageRemoved = () => {
    setImageUrl('')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Title */}
      <Input
        label="Product Title"
        {...register('title')}
        error={errors.title?.message as string | undefined}
        placeholder="e.g. Wireless Headphones"
        disabled={isSubmitting}
      />

      {/* Description */}
      <Textarea
        label="Description"
        {...register('description')}
        error={errors.description?.message as string | undefined}
        placeholder="Detailed product description..."
        disabled={isSubmitting}
        rows={6}
      />

      {/* Price and Stock - Side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Price (USD)"
          type="number"
          step="0.01"
          {...register('price')}
          error={errors.price?.message as string | undefined}
          placeholder="0.00"
          disabled={isSubmitting}
        />

        <Input
          label="Stock Quantity"
          type="number"
          {...register('stock')}
          error={errors.stock?.message as string | undefined}
          placeholder="0"
          disabled={isSubmitting}
        />
      </div>

      {/* Category */}
      <Select
        label="Category"
        {...register('category')}
        options={PRODUCT_CATEGORIES.map(cat => ({
          value: cat,
          label: cat.charAt(0).toUpperCase() + cat.slice(1)
        }))}
        error={errors.category?.message as string | undefined}
        disabled={isSubmitting}
      />

      {/* Image Upload */}
      <ImageUpload
        currentImageUrl={imageUrl}
        onImageUploaded={handleImageUploaded}
        onImageRemoved={handleImageRemoved}
      />

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting
            ? mode === 'create'
              ? 'Creating...'
              : 'Updating...'
            : mode === 'create'
              ? 'Create Product'
              : 'Update Product'
          }
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/products')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
