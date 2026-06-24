import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { checkAdminAuth } from '@/lib/superadmin-auth'

export async function GET(request: NextRequest) {
  const auth = checkAdminAuth(request)
  if (auth) return auth

  try {
    const groups = await query(
      `SELECT id, name, position, required, max_select, active, created_at
       FROM variant_group_templates
       WHERE tenant_id IS NULL
       ORDER BY position, created_at`
    )

    const options = await query(
      `SELECT vot.id, vot.group_template_id, vot.name, vot.position, vot.price_delta, vot.active
       FROM variant_option_templates vot
       INNER JOIN variant_group_templates vgt ON vot.group_template_id = vgt.id
       WHERE vgt.tenant_id IS NULL
       ORDER BY vot.position, vot.created_at`
    )

    const optionsByGroup = options.rows.reduce((acc: Record<string, any[]>, opt) => {
      if (!acc[opt.group_template_id]) acc[opt.group_template_id] = []
      acc[opt.group_template_id].push(opt)
      return acc
    }, {})

    const result = groups.rows.map(g => ({
      ...g,
      options: optionsByGroup[g.id] || [],
    }))

    return NextResponse.json({ ok: true, groups: result })
  } catch (error) {
    console.error('[superadmin/variant-groups GET]', error)
    return NextResponse.json({ error: 'Failed to fetch variant groups' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = checkAdminAuth(request)
  if (auth) return auth

  try {
    const { name, required = false, max_select = 1, position = 0, options = [] } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'name es requerido' }, { status: 400 })
    }

    const groupResult = await query(
      `INSERT INTO variant_group_templates (name, position, required, max_select, active, tenant_id)
       VALUES ($1, $2, $3, $4, true, NULL)
       RETURNING *`,
      [name, position, required, max_select]
    )

    const group = groupResult.rows[0]

    if (options.length > 0) {
      for (let i = 0; i < options.length; i++) {
        const opt = options[i]
        await query(
          `INSERT INTO variant_option_templates (group_template_id, name, position, price_delta, active)
           VALUES ($1, $2, $3, $4, true)`,
          [group.id, opt.name, i, opt.price_delta || 0]
        )
      }
    }

    return NextResponse.json({ ok: true, group })
  } catch (error) {
    console.error('[superadmin/variant-groups POST]', error)
    return NextResponse.json({ error: 'Failed to create variant group' }, { status: 500 })
  }
}