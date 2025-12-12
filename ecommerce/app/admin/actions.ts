'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function checkFirstAdmin() {
    const supabase = createAdminClient()
    const { data: { users }, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 })

    if (error) {
        console.error('Error checking users:', error)
        // In strict mode, error might be thrown. Return true to fail-safe block registration? 
        // No, better to assume user exists or system error to prevent security hole.
        // If error, return false (not first admin)
        return false
    }

    return users.length === 0
}

export async function registerFirstAdmin(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email y contraseña son requeridos' }
    }

    if (password.length < 6) {
        return { error: 'La contraseña debe tener al menos 6 caracteres' }
    }

    const supabase = createAdminClient()

    // Verify no users exist (Double check)
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 })

    if (listError || users.length > 0) {
        return { error: 'Ya existe un administrador registrado o hubo un error.' }
    }

    // Create user
    const { error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'admin' }
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function resetPassword(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    if (!email) return { error: 'Email requerido' }

    const supabase = await createClient()
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Redirect to callback which then redirects to update-password
    const redirectTo = `${origin}/api/auth/callback?next=/admin/update-password`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
    })

    if (error) {
        return { error: error.message }
    }
    return { success: true }
}

export async function updatePassword(prevState: any, formData: FormData) {
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!password || password.length < 6) {
        return { error: 'La contraseña debe tener al menos 6 caracteres' }
    }

    if (password !== confirmPassword) {
        return { error: 'Las contraseñas no coinciden' }
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        return { error: error.message }
    }
    return { success: true }
}
