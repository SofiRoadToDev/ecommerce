'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react'
import type { Product } from '@/types/models'
import { useCartStore } from '@/store/cartStore'
import { t } from '@/lib/i18n'

interface ProductDetailClientProps {
    product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const addItem = useCartStore(state => state.addItem)
    const [isAdding, setIsAdding] = useState(false)

    const handleAddToCart = () => {
        setIsAdding(true)
        addItem(product)

        setTimeout(() => setIsAdding(false), 1000)
    }

    const isOutOfStock = product.stock === 0

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-slate-600 mb-8">
                    <Link href="/" className="hover:text-slate-900 transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <span className="text-slate-900">{product.title}</span>
                </nav>

                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to products
                </Link>

                {/* Product Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-lg">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-24 h-24 text-slate-300" />
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl font-bold text-slate-900">
                                ${product.price.toFixed(2)}
                            </span>

                            {isOutOfStock ? (
                                <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                                    {t('products.outOfStock')}
                                </span>
                            ) : (
                                <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                    {t('products.inStock')} ({product.stock} available)
                                </span>
                            )}
                        </div>

                        {/* Category */}
                        {product.category_data && (
                            <div className="mb-6">
                                <span className="text-sm text-slate-600">Category:</span>
                                <span className="ml-2 text-slate-900 font-medium">
                                    {product.category_data.name}
                                </span>
                            </div>
                        )}

                        {/* Description */}
                        {product.description && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-slate-900 mb-3">
                                    Description
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || isAdding}
                            className={`
                w-full py-4 px-6 rounded-md font-semibold text-lg
                flex items-center justify-center gap-3
                transition-all duration-200
                ${isOutOfStock || isAdding
                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl hover:scale-105'
                                }
              `}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {isAdding ? 'Added!' : isOutOfStock ? t('products.outOfStock') : t('products.addToCart')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
