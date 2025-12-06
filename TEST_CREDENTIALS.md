# Test Data - Login Credentials

## Super Admin
- **URL:** https://restorder-tuordenyas-projects.vercel.app/admin
- **Password:** `SuperAdmin2024!`
- **Access:** All tenants, create/delete tenants and locations

---

## Tenant 1: Pizza Paradise

### Tenant Admin (Full Access)
- **Email:** `admin@pizzaparadise.com`
- **Password:** `password123`
- **Role:** tenant_admin
- **Access:** All locations, full menu management, can change prices

### Manager - Downtown Branch
- **Email:** `manager.downtown@pizzaparadise.com`
- **Password:** `password123`
- **Role:** manager
- **Location:** Downtown Branch only
- **Access:** Toggle item availability, view orders, manage tables
- **Restrictions:** Cannot change prices or edit items

### Manager - Westside Branch
- **Email:** `manager.westside@pizzaparadise.com`
- **Password:** `password123`
- **Role:** manager
- **Location:** Westside Branch only
- **Access:** Toggle item availability, view orders, manage tables
- **Restrictions:** Cannot change prices or edit items

### Waiter - Downtown
- **Email:** `waiter1@pizzaparadise.com`
- **Password:** `password123`
- **Role:** waiter
- **Location:** Downtown Branch
- **Access:** Take orders, view tables

### Waiter - Westside
- **Email:** `waiter2@pizzaparadise.com`
- **Password:** `password123`
- **Role:** waiter
- **Location:** Westside Branch
- **Access:** Take orders, view tables

---

## Tenant 2: Burger Blast

### Tenant Admin (Full Access)
- **Email:** `admin@burgerblast.com`
- **Password:** `password123`
- **Role:** tenant_admin
- **Access:** All locations, full menu management, can change prices

### Manager - Main Street
- **Email:** `manager.main@burgerblast.com`
- **Password:** `password123`
- **Role:** manager
- **Location:** Main Street only
- **Access:** Toggle item availability, view orders, manage tables
- **Restrictions:** Cannot change prices or edit items

### Manager - Mall Location
- **Email:** `manager.mall@burgerblast.com`
- **Password:** `password123`
- **Role:** manager
- **Location:** Mall Location only
- **Access:** Toggle item availability, view orders, manage tables
- **Restrictions:** Cannot change prices or edit items

### Waiter - Main Street
- **Email:** `waiter.main@burgerblast.com`
- **Password:** `password123`
- **Role:** waiter
- **Location:** Main Street
- **Access:** Take orders, view tables

### Waiter - Mall
- **Email:** `waiter.mall@burgerblast.com`
- **Password:** `password123`
- **Role:** waiter
- **Location:** Mall Location
- **Access:** Take orders, view tables

---

## Database Summary

### Tenant 1: Pizza Paradise
- **Slug:** pizza-paradise
- **Locations:** 2 (Downtown Branch, Westside Branch)
- **Categories:** 5 (Pizzas, Appetizers, Salads, Desserts, Drinks)
- **Items:** 15 menu items
- **Tables:** 9 total (5 at Downtown, 4 at Westside)
- **Users:** 5 (1 admin, 2 managers, 2 waiters)

### Tenant 2: Burger Blast
- **Slug:** burger-blast
- **Locations:** 2 (Main Street, Mall Location)
- **Categories:** 5 (Burgers, Sides, Shakes, Salads, Beverages)
- **Items:** 17 menu items
- **Tables:** 8 total (5 at Main Street, 3 at Mall)
- **Users:** 5 (1 admin, 2 managers, 2 waiters)

---

## Installation Steps

1. **Run migrations in Supabase SQL Editor (in order):**
   ```sql
   -- First: Add slug column (already done)
   -- sql/add_tenant_slug.sql
   
   -- Second: Add role columns
   -- sql/add_user_roles.sql
   
   -- Third: Seed test data
   -- sql/seed_test_data.sql
   ```

2. **Test the data:**
   - Login to Super Admin panel
   - View both tenants
   - Login to backoffice with any tenant admin account
   - Test manager and waiter accounts (when interfaces are ready)

---

## Next Steps

1. **Update login API** to return user role and location_id in JWT
2. **Update backoffice** to show/hide features based on role
3. **Implement manager interface** with limited permissions
4. **Build waiter app** (separate simple interface)
5. **Add location selector** for tenant admins
6. **Implement location-specific item availability** (item_locations table)

---

**Note:** All passwords are `password123` except Super Admin which is `SuperAdmin2024!`
