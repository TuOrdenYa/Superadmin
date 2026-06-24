import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { checkAdminAuth } from '@/lib/superadmin-auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const auth = checkAdminAuth(request)
  if (auth) return auth

  try {
    const { noteId } = await params
    await query(`DELETE FROM superadmin_notes WHERE id = $1`, [noteId])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[superadmin/notes DELETE]', error)
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
}