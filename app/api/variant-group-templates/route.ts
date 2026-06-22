import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/variant-group-templates - List all variant group templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get("tenant_id");

    if (!tenant_id) {
      return NextResponse.json({ error: "tenant_id is required" }, { status: 400 });
    }

    // Resolve tenant UUID
    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenant_id)]
    );
    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ ok: true, groups: [] });
    }

    const result = await query(
      `SELECT id, name, position, required, max_select, active
       FROM variant_group_templates
       WHERE active = true
       ORDER BY position, id`
    );

    return NextResponse.json({ ok: true, groups: result.rows });
  } catch (error) {
    console.error("Error fetching variant groups:", error);
    return NextResponse.json({ error: "Failed to fetch variant groups" }, { status: 500 });
  }
}

// POST /api/variant-group-templates - Create a new variant group template (global)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position = 0, required = false, max_select = 1, tenant_id } = body;

    if (!name || !tenant_id) {
      return NextResponse.json({ error: "name and tenant_id are required" }, { status: 400 });
    }

    // Resolve tenant UUID
    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenant_id)]
    );
    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const result = await query(
      `INSERT INTO variant_group_templates (name, position, required, max_select, active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING *`,
      [name, position, required, max_select]
    );

    return NextResponse.json({ ok: true, group: result.rows[0] });
  } catch (error) {
    console.error("Error creating variant group:", error);
    return NextResponse.json({ error: "Failed to create variant group" }, { status: 500 });
  }
}