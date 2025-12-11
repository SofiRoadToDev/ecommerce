'use client'

import { useState } from 'react'
import { Pagination } from '@/components/ui/Pagination'
import { ProductTableClient } from '@/components/admin/ProductTableClient'
import type { Product } from '@/types/models'

interface LowStockProductTableProps {
    products: Product[]
}

const ITEMS_PER_PAGE = 10

export function LowStockProductTable({ products }: LowStockProductTableProps) {
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="space-y-6">
            <ProductTableClient products={currentProducts} />

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    )
}
