'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/auth'
import type { Branding } from '@/types/models'

export async function getBranding() {
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
        throw new Error('Unauthorized')
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('branding')
        .select('*')
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Results contain 0 rows"
        console.error('Error fetching branding:', error)
        return null
    }

    return data as Branding | null
}

export async function updateBranding(data: Partial<Branding>, id?: string) {
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
        throw new Error('Unauthorized')
    }

    const supabase = createAdminClient()

    let error

    if (id) {
        // Update existing
        const { error: updateError } = await supabase
            .from('branding')
            .update({
                brand_name: data.brand_name,
                logo_url: data.logo_url,
                primary_color: data.primary_color,
                secondary_color: data.secondary_color
            })
            .eq('id', id)
        error = updateError
    } else {
        // Create new (Singleton)
        // First check if one exists to avoid duplicates
        const { data: existing } = await supabase.from('branding').select('id').single()

        if (existing) {
            const { error: updateError } = await supabase
                .from('branding')
                .update({
                    brand_name: data.brand_name,
                    logo_url: data.logo_url,
                    primary_color: data.primary_color,
                    secondary_color: data.secondary_color
                })
                .eq('id', existing.id)
            error = updateError
        } else {
            const { error: insertError } = await supabase
                .from('branding')
                .insert({
                    brand_name: data.brand_name || 'My Store',
                    logo_url: data.logo_url,
                    primary_color: data.primary_color,
                    secondary_color: data.secondary_color
                })
            error = insertError
        }
    }

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/branding')
    revalidatePath('/', 'layout') // Revalidate public layout to show new logo/name
}
