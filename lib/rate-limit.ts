import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

const RATE_LIMITS = {
  light: 100,
  plus: 500,
  pro: 999999,
};

export async function checkRateLimit(tenantId: string, tier: 'light' | 'plus' | 'pro'): Promise<RateLimitResult> {
  try {
    const now = new Date();
    const windowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0);
    const windowEnd = new Date(windowStart.getTime() + 60 * 60 * 1000);

    const result = await query(
      `INSERT INTO rate_limits (tenant_id, window_start, request_count, updated_at)
       VALUES ($1, $2, 1, NOW())
       ON CONFLICT (tenant_id, window_start)
       DO UPDATE SET 
         request_count = rate_limits.request_count + 1,
         updated_at = NOW()
       RETURNING request_count`,
      [tenantId, windowStart]
    );

    const currentCount = result.rows[0]?.request_count || 0;
    const limit = RATE_LIMITS[tier] || RATE_LIMITS.light;
    const remaining = Math.max(0, limit - currentCount);
    const allowed = currentCount <= limit;

    return { allowed, limit, remaining, reset: windowEnd };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return {
      allowed: true,
      limit: RATE_LIMITS[tier] || RATE_LIMITS.light,
      remaining: RATE_LIMITS[tier] || RATE_LIMITS.light,
      reset: new Date(Date.now() + 60 * 60 * 1000),
    };
  }
}

export async function withRateLimit(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    let tenantId = searchParams.get('tenant_id');
    
    if (!tenantId && (request.method === 'POST' || request.method === 'PUT')) {
      try {
        const body = await request.clone().json();
        tenantId = body.tenant_id;
      } catch {
        // Ignore JSON parse errors
      }
    }

    if (!tenantId) {
      return handler(request);
    }

    // Look up tenant by tax_id OR by uuid (handles both cases)
    const tenantResult = await query(
      `SELECT id, product_tier FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenantId)]
    );

    if (tenantResult.rows.length === 0) {
      return handler(request);
    }

    const tier = tenantResult.rows[0].product_tier || 'light';
    const tenantUuid = tenantResult.rows[0].id;

    const rateLimitResult = await checkRateLimit(tenantUuid, tier);

    const response = await handler(request);
    
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toISOString());

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `You have exceeded the ${rateLimitResult.limit} requests per hour limit for your ${tier} tier.`,
          limit: rateLimitResult.limit,
          reset: rateLimitResult.reset,
          upgrade_url: '/pricing'
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.reset.toISOString(),
            'Retry-After': Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    return response;
  } catch (error) {
    console.error('Rate limit middleware error:', error);
    return handler(request);
  }
}