import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { LowStockProductTable } from '@/components/admin/LowStockProductTable'
import type { Product } from '@/types/models'

export const dynamic = 'force-dynamic'


async function getLowStockProducts(): Promise<Product[]> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .lt('stock', 5) // filter low stock
        .order('created_at', { ascending: false })
        .returns<Product[]>()

    if (error) {
        console.error('Error fetching products:', error)
        return []
    }

    return data || []
}


export default async function ProductsPage() {
    // Require admin authentication
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
        redirect('/admin/login')
    }

    const lowStockProducts = await getLowStockProducts()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Low Stock Products</h1>
                    <p className="text-gray-600 mt-1 dark:text-gray-400">
                        Manage your product inventory
                    </p>
                </div>
            </div>

            {/* Products Table with Pagination */}
            <LowStockProductTable products={lowStockProducts} />
        </div>
    )
}