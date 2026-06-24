import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from './middleware/superadmin'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login')
  ) {
    const cookie = req.cookies.get('sa_session')?.value
    if (!cookie || !verifySession(cookie)) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}