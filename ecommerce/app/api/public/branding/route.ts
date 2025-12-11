'use server'

import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('branding').select('*').single()
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } })
}
