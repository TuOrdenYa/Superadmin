import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeServed = searchParams.get('includeServed');
    const tenantId = searchParams.get('tenant_id');
    const locationId = searchParams.get('location_id');
    const table = searchParams.get('table');

    const statuses = ['OPEN', 'READY'];
    if (includeServed === 'true') {
      statuses.push('SERVED');
    }

    const where: string[] = ['status = ANY($1)'];
    const params: any[] = [statuses];
    let paramIndex = 2;

    if (tenantId && !isNaN(Number(tenantId))) {
      where.push(`tenant_id = $${paramIndex++}`);
      params.push(Number(tenantId));
    }

    if (locationId && !isNaN(Number(locationId))) {
      where.push(`location_id = $${paramIndex++}`);
      params.push(Number(locationId));
    }

    if (table && String(table).trim() !== '') {
      const tableQuery = String(table).trim();
      const tableNum = Number(tableQuery);

      if (!isNaN(tableNum)) {
        where.push(`(table_id = $${paramIndex} OR table_label ILIKE $${paramIndex + 1})`);
        params.push(tableNum, `%${tableQuery}%`);
        paramIndex += 2;
      } else {
        where.push(`table_label ILIKE $${paramIndex++}`);
        params.push(`%${tableQuery}%`);
      }
    }

    const sql = `SELECT * FROM orders WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT 200`;
    const result = await query(sql, params);

    return NextResponse.json({
      ok: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error('[GET /api/kds/orders] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Error al obtener órdenes' },
      { status: 500 }
    );
  }
}
