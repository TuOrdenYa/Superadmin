import { NextResponse } from 'next/server'

const COOKIE_NAME = 'sa_session'
const COOKIE_TTL  = 60 * 60 * 8

export function verifySession(cookie: string): boolean {
  const [tsStr] = cookie.split('.')
  if (!tsStr) return false
  const ts = parseInt(tsStr, 10)
  if (isNaN(ts)) return false
  const age = Math.floor(Date.now() / 1000) - ts
  return age < COOKIE_TTL
}

export function setSessionCookie(res: NextResponse): void {
  const ts = Math.floor(Date.now() / 1000)
  res.cookies.set(COOKIE_NAME, String(ts), {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   COOKIE_TTL,
    path:     '/admin',
  })
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/admin' })
}