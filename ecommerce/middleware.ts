import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Inicializa Supabase con manejo avanzado de cookies para Next.js SSR
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname
  const isAdminPath = pathname.startsWith('/admin')

  // Solo ejecutamos lógica de auth en rutas de admin para optimizar
  if (!isAdminPath) return response

  // IMPORTANTE: getUser() refresca el token si es necesario
  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.user_metadata?.role || user?.app_metadata?.role

  const isAdminLoginPath = pathname === '/admin/login'

  // Si está en login y ya es admin, redirige al dashboard
  if (isAdminLoginPath) {
    if (user && role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return response
  }

  // Protección de rutas admin
  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (role !== 'admin') {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
