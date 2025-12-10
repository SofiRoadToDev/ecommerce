'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { t } from '@/lib/i18n'
import { formatPrice, cn } from '@/lib/utils'
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
    <div className={cn(
      "group relative bg-white rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100",
      isOutOfStock && "opacity-60"
    )}>
      {/* Image container */}
      <div className="aspect-[4/5] relative overflow-hidden rounded-xl mb-4 bg-gray-50">
        {product.image_url ? (
          <Image
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            fill
            src={product.image_url}
            alt={product.title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOutOfStock && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {t('products.outOfStock')}
            </span>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              Last items
            </span>
          )}
        </div>
      </div>

      {/* Product info */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
            {product.category}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-xl font-bold text-slate-900">
            {formatPrice(product.price)}
          </p>

          <Button
            size="sm"
            className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-5 transition-transform active:scale-95"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Sold Out' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  )
}
