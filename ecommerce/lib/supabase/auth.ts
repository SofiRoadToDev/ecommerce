import { createClient } from './server'

// Devuelve la sesión actual desde Supabase
export async function getSession() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getSession()
    return data.session || null
  } catch (error) {
    console.error('Error obteniendo sesión:', error)
    return null
  }
}

// Devuelve el usuario actual (o null)
export async function getUser() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    return data.user || null
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    return null
  }
}

// Verifica si el usuario tiene rol admin en metadata
export async function isAdmin() {
  const user = await getUser()
  if (!user) return false

  const role = (user.user_metadata as any)?.role || (user.app_metadata as any)?.role
  return role === 'admin'
}

// Lanza error si no es admin
export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized: Admin access required')
  }
  return true
}
