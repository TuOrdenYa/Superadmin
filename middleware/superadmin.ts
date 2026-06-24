import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_SECRET = process.env.COOKIE_SECRET!
const COOKIE_NAME   = 'sa_session'
const COOKIE_TTL    = 60 * 60 * 8

export function signSession(ts: number): string {
  const payload = String(ts)
  const mac = createHmac('sha256', COOKIE_SECRET).update(payload).digest('hex')
  return `${payload}.${mac}`
}

export function verifySession(cookie: string): boolean {
  const [tsStr, mac] = cookie.split('.')
  if (!tsStr || !mac) return false

  const ts = parseInt(tsStr, 10)
  if (isNaN(ts)) return false

  const expected = createHmac('sha256', COOKIE_SECRET).update(tsStr).digest('hex')
  try {
    const match = timingSafeEqual(Buffer.from(mac, 'hex'), Buffer.from(expected, 'hex'))
    if (!match) return false
  } catch {
    return false
  }

  const age = Math.floor(Date.now() / 1000) - ts
  return age < COOKIE_TTL
}

export function setSessionCookie(res: NextResponse): void {
  const ts  = Math.floor(Date.now() / 1000)
  const val = signSession(ts)
  res.cookies.set(COOKIE_NAME, val, {
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