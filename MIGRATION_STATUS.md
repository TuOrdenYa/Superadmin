# RestOrder - Backend Migration Complete ✅

## 🎉 What We Successfully Migrated

### ✅ Database Setup
- **Supabase PostgreSQL** - All 33 tables loaded from schema
- **Connection String** - Configured in `.env.local`
- **Seed Data** - Test tenant, location, users, menu items

### ✅ API Endpoints (All Working)

#### Authentication
- `POST /api/auth/login` - User login with JWT
- `GET /api/auth/me` - Get current user info

#### Orders (Core Business Logic)
- `POST /api/orders` - Create new orders
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status

#### Menu & Categories
- `GET /api/menu` - Get menu items for customer view
- `GET /api/categories` - Get all categories

#### Backoffice
- `GET /api/backoffice/items` - Get items with location overrides

#### Kitchen Display System (KDS)
- `GET /api/kds/orders` - Get orders for kitchen display

### ✅ Infrastructure
- `lib/db.ts` - PostgreSQL connection pooling
- `lib/auth.ts` - JWT & bcrypt password hashing
- Test page at `/test` for API validation

---

## 🔧 How to Prevent Future Issues

### 1. **Always Keep Server Running During Development**

Start the server:
```bash
npm run dev
```

The server should show:
```
✓ Ready in XXXms
Local: http://localhost:3000
```

**If it crashes:** Just run `npm run dev` again

---

### 2. **Environment Variables (.env.local)**

**NEVER commit this file to git** - it contains sensitive data

Current configuration:
```env
DATABASE_URL=postgresql://postgres.jqpelyhmichbtmbhcckp:xYsDt1XPrvTXTOlb@aws-1-sa-east-1.pooler.supabase.com:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXT_PUBLIC_APP_NAME=RestOrder
```

**To update production:** Change these in Vercel dashboard under Settings > Environment Variables

---

### 3. **Password Hashing**

**IMPORTANT:** When creating new users, ALWAYS hash passwords!

```bash
# Generate hash for any password
node -e "import('bcrypt').then(bcrypt => bcrypt.default.hash('YOUR_PASSWORD', 10).then(hash => console.log('Hash:', hash)))"
```

Then insert into Supabase:
```sql
INSERT INTO users (tenant_id, email, password_hash, full_name, role, is_active)
VALUES (1, 'user@example.com', 'PASTE_HASH_HERE', 'User Name', 'admin', true);
```

---

### 4. **Test API After Changes**

Visit: http://localhost:3000/test

Click all buttons to verify:
- ✅ Green = Working
- ❌ Red = Error (check server logs)

---

### 5. **Database Schema Changes**

If you need to modify the database:

1. **Make changes in Supabase SQL Editor** (don't modify local schema.sql)
2. **Test locally first** with test queries
3. **Update `sql/schema.sql`** to match (for documentation)

---

### 6. **Common Issues & Solutions**

#### Issue: "Cannot connect to server"
**Solution:** Server crashed or not running
```bash
npm run dev
```

#### Issue: Login returns 401 "Credenciales inválidas"
**Solution:** Password hash doesn't match
- Generate new hash (see section 3)
- Update in Supabase

#### Issue: Foreign key constraint error (location_id, tenant_id, etc.)
**Solution:** Missing data in referenced table
- Check Supabase table editor
- Add missing records first

#### Issue: Database connection timeout
**Solution:** Supabase pooler issue
- Check DATABASE_URL is correct
- Verify Supabase project is active
- Check network connection

---

### 7. **Adding New API Endpoints**

Template for new endpoints:

```typescript
// app/api/YOUR_ROUTE/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const param = searchParams.get('param');
    
    const result = await query('SELECT * FROM table WHERE col = $1', [param]);
    
    return NextResponse.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('[GET /api/YOUR_ROUTE] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Error message' },
      { status: 500 }
    );
  }
}
```

**Test it** by adding a button to `/app/test/page.tsx`

---

### 8. **Deployment Checklist (Vercel)**

Before deploying:

- [ ] All tests pass locally (green checkmarks)
- [ ] Environment variables set in Vercel dashboard
- [ ] Database is accessible from Vercel IPs (Supabase allows this by default)
- [ ] JWT_SECRET is different in production
- [ ] No console.log with sensitive data

Deploy:
```bash
git add .
git commit -m "Your changes"
git push
```

Vercel will auto-deploy from your linked repository.

---

## 📋 Next Steps

### Option 1: Migrate Frontend Components
- Customer-facing pages (menu, ordering)
- Backoffice admin panel
- Kitchen display system

### Option 2: Add More Backend Features
- Real-time updates (SSE/WebSocket)
- Waiter call system
- Item variants & modifiers
- Payment processing

### Option 3: Deploy to Production
- Push to GitHub
- Deploy via Vercel
- Test in production

---

## 🆘 Emergency Recovery

If something goes completely wrong:

1. **Database backup:** Supabase has automatic backups (Settings > Database > Backups)
2. **Code rollback:** `git log` then `git checkout <commit-hash>`
3. **Fresh start:** Delete `.next` folder, run `npm install`, then `npm run dev`

---

## 📞 Key Information

- **Local Server:** http://localhost:3000
- **Test Page:** http://localhost:3000/test
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Project ID (Vercel):** prj_kmxwXA7ZjgztG9Uv7QzGBwtEqNL4

---

**Last Updated:** December 5, 2025  
**Status:** ✅ Backend fully migrated and tested  
**Next Priority:** Frontend migration or deployment
