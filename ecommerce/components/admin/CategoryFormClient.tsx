'use client'

import { CategoryForm } from './CategoryForm'
import { updateCategory } from '@/app/admin/categories/actions'
import type { Category } from '@/types/models'

interface CategoryFormClientProps {
    initialData: Category
}

export function CategoryFormClient({ initialData }: CategoryFormClientProps) {
    const handleSubmit = async (data: Partial<Category>) => {
        await updateCategory(initialData.id, data)
    }

    return <CategoryForm initialData={initialData} onSubmit={handleSubmit} />
}
