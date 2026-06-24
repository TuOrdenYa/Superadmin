import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { setSessionCookie } from '@/middleware/superadmin'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!password || !process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
  }

  let match = false
  try {
    const a = Buffer.from(password)
    const b = Buffer.from(process.env.ADMIN_PASSWORD)
    if (a.length === b.length) {
      match = timingSafeEqual(a, b)
    }
  } catch {
    match = false
  }

  if (!match) {
    await new Promise(r => setTimeout(r, 400))
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  setSessionCookie(res)
  return res
}