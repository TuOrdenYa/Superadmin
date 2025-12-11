/**
 * Generate seed data SQL with real bcrypt password hashes
 * Usage: node scripts/generate-seed-data.js
 */

import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'password123';

async function generateHash(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function generateSeedSQL() {
  console.log('🔐 Generating bcrypt hash for password...');
  const passwordHash = await generateHash(DEFAULT_PASSWORD);
  console.log(`✓ Hash generated: ${passwordHash}\n`);

  const sql = `-- Seed Test Data for Tenants 1 and 2
-- Generated automatically with real bcrypt hashes
-- Run this in Supabase SQL Editor after running add_tenant_slug.sql
-- Password for all users: ${DEFAULT_PASSWORD}

-- ========================================
-- TENANT 1: Pizza Restaurant
-- ========================================

-- Update Tenant 1 info
UPDATE tenants SET name = 'Pizza Paradise', slug = 'pizza-paradise' WHERE id = 1;

-- Locations for Tenant 1
INSERT INTO locations (tenant_id, name) VALUES
(1, 'Downtown Branch'),
(1, 'Westside Branch');

-- Users for Tenant 1
INSERT INTO users (tenant_id, location_id, email, password_hash, full_name, role, is_active) VALUES
(1, NULL, 'admin@pizzaparadise.com', '${passwordHash}', 'John Admin', 'admin', true),
(1, 1, 'manager.downtown@pizzaparadise.com', '${passwordHash}', 'Sarah Manager', 'manager', true),
(1, 2, 'manager.westside@pizzaparadise.com', '${passwordHash}', 'Mike Manager', 'manager', true),
(1, 1, 'waiter1@pizzaparadise.com', '${passwordHash}', 'Emma Waiter', 'waiter', true),
(1, 2, 'waiter2@pizzaparadise.com', '${passwordHash}', 'Tom Waiter', 'waiter', true);

-- Categories for Tenant 1
INSERT INTO categories (tenant_id, name, position, active) VALUES
(1, 'Pizzas', 1, true),
(1, 'Appetizers', 2, true),
(1, 'Salads', 3, true),
(1, 'Desserts', 4, true),
(1, 'Drinks', 5, true);

-- Items for Tenant 1
INSERT INTO menu_items (tenant_id, category_id, name, description, price, active) VALUES
-- Pizzas
(1, (SELECT id FROM categories WHERE tenant_id = 1 AND name = 'Pizzas'), 'Margherita', 'Classic pizza with tomato sauce, mozzarella, and basil', 12.99, true),
(1, (SELECT id FROM categories WHERE tenant_id = 1 AND name = 'Pizzas'), 'Pepperoni', 'Loaded with pepperoni and extra cheese', 14.99, true),
(1, (SELECT id FROM categories WHERE tenant_id = 1 AND name = 'Pizzas'), 'Hawaiian', 'Ham, pineapple, and mozzarella', 13.99, true),
(1, (SELECT id FROM categories WHERE tenant_id = 1 AND name = 'Pizzas'), 'Veggie Supreme', 'Bell peppers, onions, mushrooms, olives, tomatoes', 13.99, true),
(1, (SELECT id FROM categories WHERE tenant_id = 1 AND name = 'Pizzas'), 'Meat Lovers', 'Pepperoni, sausage, bacon, ham', 16.99, true),
-- Appetizers
(1, (SELECT id FROM categories WHERE tenant_id = 1 AND name = 'Appetizers'), 'Garlic Bread', 'Toasted bread with garlic butter', 5.99, true),
(1, (SELECT id FROM categories WHERE tenant_id = 1 AND name = 'Appetizers'), 'Mozzarella Sticks', '6 pieces with marinara sauce', 7.99, true),
(1, (SELECT id FROM categories WHERE tenant_id = 1 AND name = 'Appetizers'), 'Buffalo Wings', '8 pieces with ranch or blue cheese', 9.99, true),
-- Salads
(1, (SELECT id FROM categories WHERE tenant_id = 1 AND name = 'Salads'), 'Caesar Salad', 'Romaine lettuce, parmesan, croutons, Caesar dressing', 8.99, true),
(1, (SELECT id FROM categories WHERE tenant_id = 1 AND name = 'Salads'), 'Garden Salad', 'Mixed greens, tomatoes, cucumbers, carrots', 7.99, true),
-- Desserts
(1, (SELECT id FROM categories WHERE tenant_id = 1 AND name = 'Desserts'), 'Tiramisu', 'Classic Italian dessert', 6.99, true),
(1, (SELECT id FROM categories WHERE tenant_id = 1 AND name = 'Desserts'), 'Chocolate Cake', 'Rich chocolate layer cake', 5.99, true),
-- Drinks
(1, (SELECT id FROM categories WHERE tenant_id = 1 AND name = 'Drinks'), 'Coca-Cola', '12oz can', 2.50, true),
(1, (SELECT id FROM categories WHERE tenant_id = 1 AND name = 'Drinks'), 'Sprite', '12oz can', 2.50, true),
(1, (SELECT id FROM categories WHERE tenant_id = 1 AND name = 'Drinks'), 'Iced Tea', 'Fresh brewed', 2.99, true);

-- Tables for Tenant 1 - Location 1 (Downtown)
INSERT INTO tables (location_id, number, tenant_id) VALUES
((SELECT id FROM locations WHERE tenant_id = 1 AND name = 'Downtown Branch'), '1', 1),
((SELECT id FROM locations WHERE tenant_id = 1 AND name = 'Downtown Branch'), '2', 1),
((SELECT id FROM locations WHERE tenant_id = 1 AND name = 'Downtown Branch'), '3', 1),
((SELECT id FROM locations WHERE tenant_id = 1 AND name = 'Downtown Branch'), '4', 1),
((SELECT id FROM locations WHERE tenant_id = 1 AND name = 'Downtown Branch'), '5', 1);

-- Tables for Tenant 1 - Location 2 (Westside)
INSERT INTO tables (location_id, number, tenant_id) VALUES
((SELECT id FROM locations WHERE tenant_id = 1 AND name = 'Westside Branch'), '1', 1),
((SELECT id FROM locations WHERE tenant_id = 1 AND name = 'Westside Branch'), '2', 1),
((SELECT id FROM locations WHERE tenant_id = 1 AND name = 'Westside Branch'), '3', 1),
((SELECT id FROM locations WHERE tenant_id = 1 AND name = 'Westside Branch'), '4', 1);


-- ========================================
-- TENANT 2: Burger Joint
-- ========================================

-- Create or update Tenant 2
INSERT INTO tenants (id, name, slug) VALUES
(2, 'Burger Blast', 'burger-blast')
ON CONFLICT (id) DO UPDATE SET name = 'Burger Blast', slug = 'burger-blast';

-- Locations for Tenant 2
INSERT INTO locations (tenant_id, name) VALUES
(2, 'Main Street'),
(2, 'Mall Location');

-- Users for Tenant 2
INSERT INTO users (tenant_id, location_id, email, password_hash, full_name, role, is_active) VALUES
(2, NULL, 'admin@burgerblast.com', '${passwordHash}', 'Lisa Admin', 'admin', true),
(2, (SELECT id FROM locations WHERE tenant_id = 2 AND name = 'Main Street'), 'manager.main@burgerblast.com', '${passwordHash}', 'David Manager', 'manager', true),
(2, (SELECT id FROM locations WHERE tenant_id = 2 AND name = 'Mall Location'), 'manager.mall@burgerblast.com', '${passwordHash}', 'Rachel Manager', 'manager', true),
(2, (SELECT id FROM locations WHERE tenant_id = 2 AND name = 'Main Street'), 'waiter.main@burgerblast.com', '${passwordHash}', 'Chris Waiter', 'waiter', true),
(2, (SELECT id FROM locations WHERE tenant_id = 2 AND name = 'Mall Location'), 'waiter.mall@burgerblast.com', '${passwordHash}', 'Amy Waiter', 'waiter', true);

-- Categories for Tenant 2
INSERT INTO categories (tenant_id, name, position, active) VALUES
(2, 'Burgers', 1, true),
(2, 'Sides', 2, true),
(2, 'Shakes', 3, true),
(2, 'Salads', 4, true),
(2, 'Beverages', 5, true);

-- Items for Tenant 2
INSERT INTO menu_items (tenant_id, category_id, name, description, price, active) VALUES
-- Burgers
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Burgers'), 'Classic Burger', 'Beef patty, lettuce, tomato, onion, pickles', 9.99, true),
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Burgers'), 'Cheeseburger', 'Classic burger with melted cheddar', 10.99, true),
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Burgers'), 'Bacon Burger', 'With crispy bacon and BBQ sauce', 11.99, true),
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Burgers'), 'Veggie Burger', 'Plant-based patty with avocado', 10.99, true),
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Burgers'), 'Double Burger', 'Two beef patties, double cheese', 14.99, true),
-- Sides
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Sides'), 'French Fries', 'Crispy golden fries', 3.99, true),
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Sides'), 'Onion Rings', 'Beer-battered onion rings', 4.99, true),
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Sides'), 'Sweet Potato Fries', 'With honey mustard', 4.99, true),
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Sides'), 'Loaded Fries', 'Fries with cheese, bacon, sour cream', 6.99, true),
-- Shakes
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Shakes'), 'Vanilla Shake', 'Classic vanilla milkshake', 5.99, true),
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Shakes'), 'Chocolate Shake', 'Rich chocolate milkshake', 5.99, true),
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Shakes'), 'Strawberry Shake', 'Fresh strawberry milkshake', 5.99, true),
-- Salads
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Salads'), 'Chicken Caesar', 'Grilled chicken Caesar salad', 9.99, true),
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Salads'), 'Greek Salad', 'Feta, olives, cucumbers, tomatoes', 8.99, true),
-- Beverages
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Beverages'), 'Soft Drink', 'Coke, Sprite, or Fanta', 2.50, true),
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Beverages'), 'Lemonade', 'Fresh squeezed', 3.50, true),
(2, (SELECT id FROM categories WHERE tenant_id = 2 AND name = 'Beverages'), 'Iced Coffee', 'Cold brew coffee', 3.99, true);

-- Tables for Tenant 2 - Location 1 (Main Street)
INSERT INTO tables (location_id, number, tenant_id) VALUES
((SELECT id FROM locations WHERE tenant_id = 2 AND name = 'Main Street'), '1', 2),
((SELECT id FROM locations WHERE tenant_id = 2 AND name = 'Main Street'), '2', 2),
((SELECT id FROM locations WHERE tenant_id = 2 AND name = 'Main Street'), '3', 2),
((SELECT id FROM locations WHERE tenant_id = 2 AND name = 'Main Street'), '4', 2),
((SELECT id FROM locations WHERE tenant_id = 2 AND name = 'Main Street'), '5', 2);

-- Tables for Tenant 2 - Location 2 (Mall)
INSERT INTO tables (location_id, number, tenant_id) VALUES
((SELECT id FROM locations WHERE tenant_id = 2 AND name = 'Mall Location'), '1', 2),
((SELECT id FROM locations WHERE tenant_id = 2 AND name = 'Mall Location'), '2', 2),
((SELECT id FROM locations WHERE tenant_id = 2 AND name = 'Mall Location'), '3', 2);

-- Summary
SELECT 
    'Seed data created successfully!' as status,
    (SELECT COUNT(*) FROM tenants WHERE id IN (1,2)) as tenants,
    (SELECT COUNT(*) FROM locations WHERE tenant_id IN (1,2)) as locations,
    (SELECT COUNT(*) FROM users WHERE tenant_id IN (1,2)) as users,
    (SELECT COUNT(*) FROM categories WHERE tenant_id IN (1,2)) as categories,
    (SELECT COUNT(*) FROM menu_items WHERE tenant_id IN (1,2)) as items,
    (SELECT COUNT(*) FROM tables WHERE location_id IN (
        SELECT id FROM locations WHERE tenant_id IN (1,2)
    )) as tables;
`;

  const outputPath = path.join(process.cwd(), 'sql', 'seed_test_data.sql');
  fs.writeFileSync(outputPath, sql, 'utf8');
  
  console.log('✅ Seed data SQL generated successfully!');
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`\n🔑 All users have password: ${DEFAULT_PASSWORD}`);
  console.log(`🔐 Bcrypt hash: ${passwordHash}\n`);
}

generateSeedSQL().catch(console.error);
