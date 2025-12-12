import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/**
 * Combined Middleware: Authentication + Rate Limiting
 * 
 * Rate Limiting Setup:
 * 1. Create free account at https://upstash.com
 * 2. Create a Redis database
 * 3. Add credentials to .env.local:
 *    UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
 *    UPSTASH_REDIS_REST_TOKEN=AXXXxxx
 */

// Initialize Redis client (only if credentials are available)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
  : null

// Rate limiters for different endpoints
const loginRateLimit = redis
  ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 attempts per 15 minutes
    analytics: true,
    prefix: 'ratelimit:login',
  })
  : null

const registerRateLimit = redis
  ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 attempts per hour
    analytics: true,
    prefix: 'ratelimit:register:v2',
  })
  : null

const checkoutRateLimit = redis
  ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '10 m'), // 3 orders per 10 minutes
    analytics: true,
    prefix: 'ratelimit:checkout',
  })
  : null

const apiRateLimit = redis
  ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
    analytics: true,
    prefix: 'ratelimit:api',
  })
  : null

const contactRateLimit = redis
  ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '15 m'), // 3 contact submissions per 15 minutes
    analytics: true,
    prefix: 'ratelimit:contact',
  })
  : null

async function checkRateLimit(ip: string, path: string, method: string): Promise<NextResponse | null> {
  if (!redis) {
    // Rate limiting disabled in development
    return null
  }

  try {
    // Register endpoint - Prevent spam (only limit POST requests)
    if (path === '/admin/register' && registerRateLimit && method === 'POST') {
      const { success, limit, reset, remaining } = await registerRateLimit.limit(ip)

      if (!success) {
        const minutesUntilReset = Math.ceil((new Date(reset).getTime() - Date.now()) / 60000)

        return NextResponse.json(
          {
            error: `Too many registration attempts. Please wait ${minutesUntilReset} minutes.`,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            }
          }
        )
      }
    }

    // Login endpoint - Prevent brute force
    if (path === '/admin/login' && loginRateLimit) {
      const { success, limit, reset, remaining } = await loginRateLimit.limit(ip)

      if (!success) {
        const minutesUntilReset = Math.ceil((new Date(reset).getTime() - Date.now()) / 60000)

        return NextResponse.json(
          {
            error: `Too many login attempts. Please try again in ${minutesUntilReset} minutes.`,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            }
          }
        )
      }
    }

    // Checkout endpoint - Prevent spam orders
    if (path === '/api/create-paypal-order' && checkoutRateLimit) {
      const { success, limit, reset, remaining } = await checkoutRateLimit.limit(ip)

      if (!success) {
        const minutesUntilReset = Math.ceil((new Date(reset).getTime() - Date.now()) / 60000)

        return NextResponse.json(
          {
            error: `Too many order attempts. Please wait ${minutesUntilReset} minutes.`,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            }
          }
        )
      }
    }

    // Contact form - Prevent spam
    if (path === '/api/contact' && contactRateLimit) {
      const { success, limit, reset, remaining } = await contactRateLimit.limit(ip)

      if (!success) {
        const minutesUntilReset = Math.ceil((new Date(reset).getTime() - Date.now()) / 60000)

        return NextResponse.json(
          {
            error: `Too many contact submissions. Please wait ${minutesUntilReset} minutes.`,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            }
          }
        )
      }
    }

    // General API rate limiting (except webhooks)
    if (path.startsWith('/api/') && !path.startsWith('/api/webhooks/') && apiRateLimit) {
      const { success, limit, reset, remaining } = await apiRateLimit.limit(ip)

      if (!success) {
        return NextResponse.json(
          {
            error: 'Too many requests. Please slow down.',
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            }
          }
        )
      }
    }

    return null // No rate limit hit
  } catch (error) {
    console.error('Rate limiting error:', error)
    return null // Allow request if rate limiting fails
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1'

  // Check rate limiting first (applies to all routes)
  const rateLimitResponse = await checkRateLimit(ip, pathname, request.method)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  // Continue with existing Supabase auth logic
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

  const isAdminPath = pathname.startsWith('/admin')

  // Solo ejecutamos lógica de auth en rutas de admin para optimizar
  if (!isAdminPath) return response

  // IMPORTANTE: getUser() refresca el token si es necesario
  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.user_metadata?.role || user?.app_metadata?.role

  const publicAdminRoutes = ['/admin/login', '/admin/register', '/admin/forgot-password', '/admin/update-password']
  const isPublicAdminRoute = publicAdminRoutes.includes(pathname)

  // Si está en una ruta pública de admin y ya es admin, redirige al dashboard
  if (isPublicAdminRoute) {
    if (user && role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return response
  }

  // Protección de rutas admin privadas
  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (role !== 'admin') {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
}
