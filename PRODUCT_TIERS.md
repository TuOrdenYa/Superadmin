# Product Tier System Implementation

## Overview
TuOrdenYa now supports 3 product tiers with feature-based access control:

- **Light**: Menú digital + QR + WhatsApp
- **Plus**: Light + Pedidos básicos + Reportes
- **Pro**: Operación completa (mesas, cocina, reportes avanzados)

## Database Migration

### Run the migration:
```sql
-- Connect to your Supabase database and run:
\i sql/migrations/001_add_product_tiers.sql
```

Or via Supabase dashboard SQL editor:
```sql
-- Copy and paste the contents of sql/migrations/001_add_product_tiers.sql
```

### Migration adds:
- `product_tier` column (light/plus/pro)
- `subscription_status` column (active/inactive/trial/expired)
- `subscription_start_date` and `subscription_end_date`
- `created_at` and `updated_at` timestamps
- Indexes for performance

## Feature Access Control

### New files:
1. **lib/product-tiers.ts** - Tier definitions and feature flags
2. **lib/tier-access.ts** - Middleware for checking access
3. **app/api/admin/tenants/[tenantId]/tier/route.ts** - Update tenant tier

### Usage in API routes:

```typescript
import { checkFeatureAccess, createTierErrorResponse } from '@/lib/tier-access';

export async function GET(request: NextRequest) {
  const tenantId = 1;
  
  // Check if tenant has access to table management
  const access = await checkFeatureAccess(tenantId, 'table_management');
  
  if (!access.allowed) {
    return NextResponse.json(
      createTierErrorResponse(access.message!, access.tier!),
      { status: 403 }
    );
  }
  
  // Continue with normal logic...
}
```

### Usage in frontend:

```typescript
import { hasFeature, getTierDisplayName } from '@/lib/product-tiers';

// Check if feature is available
const canManageTables = hasFeature(tenant.product_tier, 'table_management');

// Show upgrade message
if (!canManageTables) {
  return <div>Requiere plan Pro</div>;
}
```

## Feature Matrix

| Feature | Light | Plus | Pro |
|---------|-------|------|-----|
| Digital Menu | ✅ | ✅ | ✅ |
| QR Codes | ✅ | ✅ | ✅ |
| WhatsApp Button | ✅ | ✅ | ✅ |
| Menu Management | ✅ | ✅ | ✅ |
| Order Management | ❌ | ✅ | ✅ |
| Basic Reports | ❌ | ✅ | ✅ |
| Table Management | ❌ | ❌ | ✅ |
| Variants | ❌ | ❌ | ✅ |
| Kitchen Display | ❌ | ❌ | ✅ |
| Multi-Location | ❌ | ❌ | ✅ |
| Advanced Reports | ❌ | ❌ | ✅ |
| Tips & Closing | ❌ | ❌ | ✅ |

## API Endpoints

### Update tenant tier
```http
PUT /api/admin/tenants/:tenantId/tier
Content-Type: application/json

{
  "product_tier": "pro",
  "subscription_status": "active",
  "subscription_end_date": "2026-12-31"
}
```

### Get tenants (now includes tier info)
```http
GET /api/admin/tenants
```

Response now includes:
```json
{
  "ok": true,
  "tenants": [
    {
      "id": 1,
      "name": "Pizza Paradise",
      "slug": "pizza-paradise",
      "product_tier": "pro",
      "subscription_status": "active",
      "subscription_start_date": "2025-01-01",
      "subscription_end_date": null,
      "created_at": "2025-01-01"
    }
  ]
}
```

## Next Steps

1. **Run migration** in Supabase
2. **Update Superadmin UI** to show and manage tiers
3. **Add tier gates** to protected features:
   - Tables tab (Pro only)
   - Variants tab (Pro only)
   - Order management (Plus/Pro only)
4. **Update backoffice** to hide unavailable features
5. **Add upgrade prompts** in UI

## Testing

```typescript
// Test tier access
import { getTenantTier, checkFeatureAccess } from '@/lib/tier-access';

const tier = await getTenantTier(1);
console.log(tier); // { product_tier: 'pro', has_access: true }

const access = await checkFeatureAccess(1, 'table_management');
console.log(access); // { allowed: true, tier: 'pro' }
```
