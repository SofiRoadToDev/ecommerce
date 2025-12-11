'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Package } from 'lucide-react'

interface ProductSalesData {
    product_id: string
    product_title: string
    total_quantity: number
    total_revenue: number
}

interface SlowMoversAccordionProps {
    products: ProductSalesData[]
}

export default function SlowMoversAccordion({ products: initialProducts }: SlowMoversAccordionProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    // Sort products: 0 sales first, then by quantity ascending
    const sortedProducts = [...initialProducts].sort((a, b) => {
        if (a.total_quantity === 0 && b.total_quantity !== 0) return -1
        if (a.total_quantity !== 0 && b.total_quantity === 0) return 1
        return a.total_quantity - b.total_quantity
    })

    if (sortedProducts.length === 0) {
        return (
            <div className="p-12 text-center">
                <div className="inline-flex p-4 rounded-full bg-slate-800/50 mb-4">
                    <Package className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400">No products found</p>
            </div>
        )
    }

    // Separate products with 0 sales and products with sales from the sorted list
    const zeroSalesProducts = sortedProducts.filter(p => p.total_quantity === 0)
    const withSalesProducts = sortedProducts.filter(p => p.total_quantity > 0)

    // Show first 3 products by default (prioritizing 0 sales)
    const displayedProducts = isExpanded ? sortedProducts : sortedProducts.slice(0, 3)
    const hasMore = sortedProducts.length > 3
    const zeroSalesCount = zeroSalesProducts.length

    // Calculate min quantity for products with sales (for progress bar reference)
    const minSalesQuantity = withSalesProducts.length > 0
        ? Math.min(...withSalesProducts.map(p => p.total_quantity))
        : 0

    return (
        <>
            <div className="divide-y divide-white/5">
                {displayedProducts.map((product, index) => {
                    const isZeroSales = product.total_quantity === 0

                    return (
                        <div key={product.product_id} className="p-6 hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isZeroSales
                                            ? 'bg-red-500/10 border-red-500/20'
                                            : 'bg-amber-500/10 border-amber-500/20'
                                        }`}>
                                        <span className={`text-lg font-bold ${isZeroSales ? 'text-red-400' : 'text-amber-400'
                                            }`}>
                                            {index + 1}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold text-slate-100 truncate group-hover:text-amber-400 transition-colors">
                                            {product.product_title}
                                        </h3>
                                        {isZeroSales && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex-shrink-0">
                                                No sales
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-slate-400">
                                            {product.total_quantity} sold
                                        </span>
                                        <span className="text-xs text-slate-600">•</span>
                                        <span className="text-xs font-medium text-amber-400">
                                            ${product.total_revenue.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="h-2 w-20 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${isZeroSales
                                                    ? 'bg-gradient-to-r from-red-500 to-red-400'
                                                    : 'bg-gradient-to-r from-amber-500 to-amber-400'
                                                }`}
                                            style={{
                                                width: isZeroSales
                                                    ? '0%'
                                                    : minSalesQuantity > 0
                                                        ? `${Math.min(100, (product.total_quantity / minSalesQuantity) * 100)}%`
                                                        : '100%'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {hasMore && (
                <div className="border-t border-white/5">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full p-4 flex items-center justify-center gap-2 text-sm font-medium text-amber-400 hover:bg-white/5 transition-colors group"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
                                Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4 group-hover:translate-y-[2px] transition-transform" />
                                Show All ({sortedProducts.length - 3} more
                                {zeroSalesCount > 0 && ` • ${zeroSalesCount} with 0 sales`})
                            </>
                        )}
                    </button>
                </div>
            )}
        </>
    )
}
