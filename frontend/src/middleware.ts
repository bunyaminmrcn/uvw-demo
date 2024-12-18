import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {

  const token = request.cookies.get('token')?.value

  // Check if the user is trying to access a protected route
  if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/posts')) {
    if (!token) {
      // Redirect to login if there's no token
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Check if the user is trying to access login page while already authenticated
  if (request.nextUrl.pathname === '/auth/login') {
    if (token) {
      // Redirect to dashboard if there's a token
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  if (request.nextUrl.pathname === '/auth/logout') {
    if (token)
      request.cookies.delete('token');
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/posts/:path*', '/auth/login']
}
