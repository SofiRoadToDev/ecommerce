'use client'

import { CategoryTable } from './CategoryTable'
import { deleteCategory } from '@/app/admin/categories/actions'
import type { Category } from '@/types/models'

interface CategoryTableClientProps {
    categories: Category[]
}

export function CategoryTableClient({ categories }: CategoryTableClientProps) {
    const handleDelete = async (categoryId: string) => {
        await deleteCategory(categoryId)
    }

    return <CategoryTable categories={categories} onDelete={handleDelete} />
}
