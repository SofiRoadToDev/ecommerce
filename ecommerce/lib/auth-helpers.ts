import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createAuthClient() {
  const cookieStore = await cookies()
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component - can be ignored
          }
        },
      },
    }
  )
}

export async function getSession() {
  try {
    const session = await getServerSession(authOptions)
    return session
  } catch (error) {
    console.error('Error obteniendo sesión:', error)
    return null
  }
}

export async function getUser() {
  const session = await getSession()
  return session?.user || null
}

export async function isAdmin() {
  const session = await getSession()
  
  if (!session?.user) return false
  
  // Verificar si el usuario tiene rol admin
  const role = session.user.role
  return role === 'admin'
}

export async function requireAdmin() {
  const admin = await isAdmin()
  
  if (!admin) {
    throw new Error('Unauthorized: Admin access required')
  }
  
  return true
}