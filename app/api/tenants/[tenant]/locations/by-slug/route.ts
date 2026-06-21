import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/tenants/[tenant]/locations/by-slug?slug=xxx
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  try {
    const { tenant } = await params;
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const result = await query(
      `SELECT l.id, l.name, l.slug, l.address, l.phone
       FROM locations l
       INNER JOIN tenants t ON t.id = l.tenant_id
       WHERE (t.slug = $1 OR t.tax_id = $1 OR t.id::text = $1)
       AND l.slug = $2
       LIMIT 1`,
      [String(tenant), String(slug)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, location: result.rows[0] });
  } catch (error) {
    console.error('Error fetching location by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch location' }, { status: 500 });
  }
}