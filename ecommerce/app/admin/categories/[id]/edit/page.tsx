import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/auth'
import { CategoryFormClient } from '@/components/admin/CategoryFormClient'
import type { Category } from '@/types/models'

interface EditCategoryPageProps {
    params: Promise<{
        id: string
    }>
}

async function getCategory(id: string): Promise<Category | null> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !data) {
        return null
    }

    return data as Category
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
        redirect('/admin/login')
    }

    const { id } = await params
    const category = await getCategory(id)

    if (!category) {
        redirect('/admin/categories')
    }

    return <CategoryFormClient initialData={category} />
}
