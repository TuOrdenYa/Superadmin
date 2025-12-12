function slugify(text: string) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/\u0300-\u036f/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashPassword } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';


const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);


export async function POST(req: NextRequest) {
  return withRateLimit(req, async (request) => {
    const data = await request.json();
    const { name, email, password, restaurant } = data;

    // Prepare values for required columns
    const now = new Date().toISOString();
    const slug = slugify(restaurant);
    if (!data.tenantId) {
      return NextResponse.json({ error: 'Tax ID (tenantId) is required.' }, { status: 400 });
    }
    const insertData = {
      name: restaurant,
      slug,
      tax_id: data.tenantId.toString(), // Ensure it's a string
      product_tier: 'light',
      subscription_status: 'active',
      subscription_start_date: now,
      subscription_end_date: null,
      ad_free: false,
      // created_at, updated_at are handled by Supabase
    };

    const { data: tenantInsert, error: tenantError } = await supabase
      .from('tenants')
      .insert([insertData])
      .select();

    if (tenantError || !tenantInsert || !tenantInsert[0] || !tenantInsert[0].id) {
      return NextResponse.json({ error: tenantError?.message || 'Tenant creation failed', insertData }, { status: 400 });
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Insert user
    const userData = {
      tenant_id: tenantInsert[0].id,
      full_name: name,
      email,
      password_hash,
      role: 'admin',
      is_active: true,
      location_id: null,
      created_at: now,
    };
    const { error: userError } = await supabase
      .from('users')
      .insert([userData]);

    if (userError) {
      return NextResponse.json({ error: userError.message, userData }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  });
}
