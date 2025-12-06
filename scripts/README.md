# Database Seed Scripts

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run seed:generate` | Generate complete seed data SQL with real bcrypt hashes |
| `npm run seed:reset-passwords` | Generate SQL to reset existing user passwords |

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

## Password Reset (Quick Fix)

If you already have users in the database but login isn't working:

```bash
npm run seed:reset-passwords
```

This will:
1. ✅ Generate a fresh bcrypt hash
2. ✅ Output SQL to update all 10 test users
3. ✅ Include verification query

Just copy the output SQL and run it in Supabase!

### When to use

- ✅ Login shows "Invalid credentials" but you know the password is correct
- ✅ You manually created users with a bad hash
- ✅ You want to quickly reset all test passwords without re-seeding everything

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
