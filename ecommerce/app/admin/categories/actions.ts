'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/auth'
import type { Category } from '@/types/models'

export async function createCategory(data: Partial<Category>) {
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
        throw new Error('Unauthorized')
    }

    if (!data.name || !data.slug) {
        throw new Error('Name and Slug are required')
    }

    const supabase = createAdminClient()

    const { error } = await supabase
        .from('categories')
        .insert({
            name: data.name,
            slug: data.slug
        })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/categories')
    redirect('/admin/categories')
}

export async function updateCategory(id: string, data: Partial<Category>) {
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
        throw new Error('Unauthorized')
    }

    const supabase = createAdminClient()

    const { error } = await supabase
        .from('categories')
        .update({
            name: data.name,
            slug: data.slug
        })
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/categories')
    redirect('/admin/categories')
}

export async function deleteCategory(id: string) {
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
        throw new Error('Unauthorized')
    }

    const supabase = createAdminClient()

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/categories')
}
