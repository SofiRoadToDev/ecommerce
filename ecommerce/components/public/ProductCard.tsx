'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { t } from '@/lib/i18n'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types/models'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem)
  const isOutOfStock = product.stock === 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isOutOfStock) {
      addItem(product)
    }
  }

  return (
    <div className={`group ${isOutOfStock ? 'opacity-60' : ''}`}>
      {/* Image container with hover effect */}
      <div className="aspect-square relative overflow-hidden rounded-xl mb-4 bg-gray-100">
        {product.image_url ? (
          <Image
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            fill
            src={product.image_url}
            alt={product.title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="space-y-2 mb-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-2xl font-bold text-gray-900">
          {formatPrice(product.price)}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant={isOutOfStock ? 'error' : 'success'}>
            {isOutOfStock ? t('products.outOfStock') : t('products.inStock')}
          </Badge>
          {product.stock > 0 && (
            <span className="text-xs text-gray-500">
              {product.stock} {t('products.stock')}
            </span>
          )}
        </div>
      </div>

      {/* Add to cart button */}
      <Button 
        variant="primary" 
        className="w-full"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        {t('products.addToCart')}
      </Button>
    </div>
  )
}
