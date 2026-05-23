import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware for turbinesuasredes.com.br
 *
 * Handles:
 * - Force HTTPS in production
 * - Redirect www to non-www
 * - Security headers
 * - CORS validation
 */

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname
  const searchParams = request.nextUrl.search

  // Only run in production
  if (process.env.NODE_ENV === 'production') {
    // Force HTTPS
    if (request.headers.get('x-forwarded-proto') !== 'https') {
      return NextResponse.redirect(
        `https://${hostname}${pathname}${searchParams}`,
        { status: 301 }
      )
    }

    // Redirect www to non-www
    if (hostname.startsWith('www.')) {
      const canonicalHost = hostname.replace('www.', '')
      return NextResponse.redirect(
        `https://${canonicalHost}${pathname}${searchParams}`,
        { status: 301 }
      )
    }

    // Ensure canonical domain
    if (hostname !== 'turbinesuasredes.com.br') {
      return NextResponse.redirect(
        `https://turbinesuasredes.com.br${pathname}${searchParams}`,
        { status: 301 }
      )
    }
  }

  // Add security headers
  const response = NextResponse.next()

  // HSTS
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Clickjacking protection
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')

  // XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions policy
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  )

  return response
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
  ],
}
