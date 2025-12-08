import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/admin/tenants - List all tenants
export async function GET(request: NextRequest) {
  try {
    const result = await query(
      `SELECT id, name, slug
       FROM tenants
       ORDER BY id DESC`
    );

    return NextResponse.json({
      ok: true,
      tenants: result.rows,
    });
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenants" },
      { status: 500 }
    );
  }
}

// POST /api/admin/tenants - Create new tenant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, product_tier = 'light' } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "name and slug are required" },
        { status: 400 }
      );
    }

    // Validate tier
    const validTiers = ['light', 'plus', 'pro'];
    if (product_tier && !validTiers.includes(product_tier)) {
      return NextResponse.json(
        { error: "Invalid product tier" },
        { status: 400 }
      );
    }

    let result;
    if (id) {
      // Use custom ID (e.g., tax ID)
      result = await query(
        `INSERT INTO tenants (id, name, slug, product_tier, subscription_status)
         VALUES ($1, $2, $3, $4, 'active')
         RETURNING *`,
        [id, name, slug, product_tier]
      );
    } else {
      // Auto-increment ID
      result = await query(
        `INSERT INTO tenants (name, slug, product_tier, subscription_status)
         VALUES ($1, $2, $3, 'active')
         RETURNING *`,
        [name, slug, product_tier]
      );
    }

    return NextResponse.json({
      ok: true,
      tenant: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json(
      { error: "Failed to create tenant" },
      { status: 500 }
    );
  }
}
