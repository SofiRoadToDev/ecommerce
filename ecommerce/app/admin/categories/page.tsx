import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { requireAdmin } from '@/lib/supabase/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { CategoryTableClient } from '@/components/admin/CategoryTableClient'
import { Button } from '@/components/ui/button'
import type { Category } from '@/types/models'

export const dynamic = 'force-dynamic'

async function getCategories(): Promise<Category[]> {
    const supabase = createAdminClient()

    const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<Category[]>()

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return categories || []
}

export default async function CategoriesPage() {
    // Require admin authentication
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
        redirect('/admin/login')
    }

    const categories = await getCategories()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
                    <p className="text-gray-600 mt-1 dark:text-gray-400">
                        Manage your product categories
                    </p>
                </div>
            </div>

            {/* Categories Table */}
            <CategoryTableClient categories={categories} />
        </div>
    )
}
