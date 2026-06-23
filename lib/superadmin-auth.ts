import { NextRequest, NextResponse } from 'next/server'

export function checkAdminAuth(req: NextRequest): NextResponse | null {
  const authHeader = req.headers.get('x-admin-password')
  
  if (!authHeader || authHeader !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    )
  }
  
  return null // autorizado, continuar
}