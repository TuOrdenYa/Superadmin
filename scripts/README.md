# Database Seed Scripts

## Automatic Seed Generation

### Usage

Instead of manually creating SQL with password hashes, use this automated script:

```bash
npm run seed:generate
```

This will:
1. ✅ Generate a real bcrypt hash for `password123`
2. ✅ Create `sql/seed_test_data.sql` with the correct hash
3. ✅ Ensure all 10 test users can login successfully

### What it does

- **Generates fresh bcrypt hashes** every time (avoiding stale/fake hashes)
- **Creates complete seed data** for 2 tenants with users, locations, categories, items, and tables
- **Uses real password hashing** so login actually works
- **Overwrites the SQL file** to keep it up-to-date

### Running the seed in Supabase

After generating:
1. Run `npm run seed:generate`
2. Copy the contents of `sql/seed_test_data.sql`
3. Paste into Supabase SQL Editor
4. Execute

### Test Credentials

All users have password: **password123**

**Tenant 1 (Pizza Paradise):**
- `admin@pizzaparadise.com` - Tenant Admin
- `manager.downtown@pizzaparadise.com` - Manager (Location 1)
- `manager.westside@pizzaparadise.com` - Manager (Location 2)
- `waiter1@pizzaparadise.com` - Waiter (Location 1)
- `waiter2@pizzaparadise.com` - Waiter (Location 2)

**Tenant 2 (Burger Blast):**
- `admin@burgerblast.com` - Tenant Admin
- `manager.main@burgerblast.com` - Manager (Main Street)
- `manager.mall@burgerblast.com` - Manager (Mall)
- `waiter.main@burgerblast.com` - Waiter (Main Street)
- `waiter.mall@burgerblast.com` - Waiter (Mall)

## Future Enhancements

Could add:
- Custom password parameter: `npm run seed:generate -- --password=mypass`
- Different user counts: `npm run seed:generate -- --users=20`
- Random data generation with faker.js
- Direct database seeding (bypass SQL file)
