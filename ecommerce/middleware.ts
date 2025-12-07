import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isAdminLoginPath = request.nextUrl.pathname === '/admin/login'

  // Si está intentando acceder a rutas de admin
  if (isAdminPath) {
    // Si está en la página de login
    if (isAdminLoginPath) {
      // Si ya está autenticado como admin, redirigir al dashboard
      if (token && token.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      // Permitir acceso al login
      return NextResponse.next()
    }

    // Para todas las demás rutas de admin, requerir autenticación
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verificar si el usuario tiene rol admin
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}