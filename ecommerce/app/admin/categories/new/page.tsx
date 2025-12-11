'use client'

import { CategoryForm } from '@/components/admin/CategoryForm'
import { createCategory } from '../actions'
import type { Category } from '@/types/models'

export default function NewCategoryPage() {
    // We can just pass the server action wrapper
    const handleSubmit = async (data: Partial<Category>) => {
        await createCategory(data)
    }

    return <CategoryForm onSubmit={handleSubmit} />
}
