import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('pos_auth_token')?.value
  const { pathname } = request.nextUrl

  // Public routes
  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  // Protected routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/staff')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/staff/:path*', '/login'],
}