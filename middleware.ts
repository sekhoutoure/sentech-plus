import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  // 1. Anti-CSRF Protection for API Mutations (POST, PUT, DELETE, PATCH)
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    
    // Validate that Origin matches Host (or allow same-origin requests)
    if (origin) {
      try {
        const originHost = new URL(origin).host
        if (originHost !== host && !host?.includes('localhost') && !host?.includes('127.0.0.1')) {
          return NextResponse.json(
            { success: false, message: 'Échec de la validation CSRF : Origine non autorisée.' },
            { status: 403 }
          )
        }
      } catch (e) {
        return NextResponse.json(
          { success: false, message: 'Échec de la validation CSRF : En-tête Origine invalide.' },
          { status: 400 }
        )
      }
    }
  }

  // 2. Clone response and attach mandatory Security Headers
  const response = NextResponse.next()

  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
  )

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
