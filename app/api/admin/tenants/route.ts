import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { checkAdminAuth } from "@/lib/superadmin-auth";

export async function GET(request: NextRequest) {
  const auth = checkAdminAuth(request);
  if (auth) return auth;

  try {
    const result = await query(`
      SELECT
        t.id,
        t.name,
        t.slug,
        t.tax_id,
        t.ad_free,
        t.product_tier,
        t.subscription_status,
        t.is_active,
        t.created_at,
        t.phone,
        t.city,
        t.currency,

        -- Sedes
        COUNT(DISTINCT l.id)                                        AS locations_count,
        COUNT(DISTINCT l.id) FILTER (WHERE l.is_active = true)     AS active_locations,

        -- Items
        COUNT(DISTINCT mi.id)                                       AS items_count,
        COUNT(DISTINCT mi.id) FILTER (WHERE mi.active = true)      AS active_items,

        -- Usuarios
        COUNT(DISTINCT u.id)                                        AS users_count,

        -- Pedidos del mes
        COUNT(DISTINCT o.id) FILTER (
          WHERE o.created_at >= date_trunc('month', now())
        )                                                           AS orders_this_month,

        -- Último pedido
        MAX(o.created_at)                                           AS last_order_at,

        -- Pipeline
        (t.name IS NOT NULL AND t.slug IS NOT NULL)                 AS pipeline_profile,
        (COUNT(DISTINCT mi.id) > 0)                                 AS pipeline_has_items,
        (COUNT(DISTINCT o.id) > 0)                                  AS pipeline_first_order

      FROM tenants t
      LEFT JOIN locations  l  ON l.tenant_id = t.id
      LEFT JOIN menu_items mi ON mi.tenant_id = t.id
      LEFT JOIN users      u  ON u.tenant_id = t.id
      LEFT JOIN orders     o  ON o.tenant_id = t.id

      GROUP BY t.id, t.name, t.slug, t.tax_id, t.ad_free,
               t.product_tier, t.subscription_status, t.is_active,
               t.created_at, t.phone, t.city, t.currency

      ORDER BY t.created_at DESC
    `);

    return NextResponse.json({ ok: true, tenants: result.rows });
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenants" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = checkAdminAuth(request);
  if (auth) return auth;

  try {
    const body = await request.json();
    const { id, name, slug, product_tier = 'light' } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "name and slug are required" },
        { status: 400 }
      );
    }

    const validTiers = ['light', 'plus', 'pro'];
    if (product_tier && !validTiers.includes(product_tier)) {
      return NextResponse.json(
        { error: "Invalid product tier" },
        { status: 400 }
      );
    }

    let result;
    if (id) {
      result = await query(
        `INSERT INTO tenants (id, name, slug, product_tier, subscription_status)
         VALUES ($1, $2, $3, $4, 'active')
         RETURNING *`,
        [id, name, slug, product_tier]
      );
    } else {
      result = await query(
        `INSERT INTO tenants (name, slug, product_tier, subscription_status)
         VALUES ($1, $2, $3, 'active')
         RETURNING *`,
        [name, slug, product_tier]
      );
    }

    return NextResponse.json({ ok: true, tenant: result.rows[0] });
  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json(
      { error: "Failed to create tenant" },
      { status: 500 }
    );
  }
}