-- Add is_custom field to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT false;

-- Update existing categories to be custom (since they were user-created)
-- We'll mark them all as custom first, then mark predefined ones below
UPDATE categories SET is_custom = true;

-- Insert predefined categories for all tenants (if they don't exist)
-- These will be marked as is_custom = false
DO $$
DECLARE
  tenant_rec RECORD;
  cat_exists BOOLEAN;
BEGIN
  FOR tenant_rec IN SELECT id FROM tenants LOOP
    -- Check and insert Appetizers/Entradas
    SELECT EXISTS(SELECT 1 FROM categories WHERE tenant_id = tenant_rec.id AND name IN ('Appetizers', 'Entradas')) INTO cat_exists;
    IF NOT cat_exists THEN
      INSERT INTO categories (tenant_id, name, position, active, is_custom)
      VALUES (tenant_rec.id, 'Appetizers', 1, true, false);
    END IF;
    
    -- Check and insert Main Courses/Platos Principales
    SELECT EXISTS(SELECT 1 FROM categories WHERE tenant_id = tenant_rec.id AND name IN ('Main Courses', 'Platos Principales')) INTO cat_exists;
    IF NOT cat_exists THEN
      INSERT INTO categories (tenant_id, name, position, active, is_custom)
      VALUES (tenant_rec.id, 'Main Courses', 2, true, false);
    END IF;
    
    -- Check and insert Desserts/Postres
    SELECT EXISTS(SELECT 1 FROM categories WHERE tenant_id = tenant_rec.id AND name IN ('Desserts', 'Postres')) INTO cat_exists;
    IF NOT cat_exists THEN
      INSERT INTO categories (tenant_id, name, position, active, is_custom)
      VALUES (tenant_rec.id, 'Desserts', 3, true, false);
    END IF;
    
    -- Check and insert Drinks/Bebidas
    SELECT EXISTS(SELECT 1 FROM categories WHERE tenant_id = tenant_rec.id AND name IN ('Drinks', 'Bebidas')) INTO cat_exists;
    IF NOT cat_exists THEN
      INSERT INTO categories (tenant_id, name, position, active, is_custom)
      VALUES (tenant_rec.id, 'Drinks', 4, true, false);
    END IF;
  END LOOP;
END $$;

-- Mark existing predefined category names as not custom
UPDATE categories 
SET is_custom = false 
WHERE name IN ('Appetizers', 'Entradas', 'Main Courses', 'Platos Principales', 'Desserts', 'Postres', 'Drinks', 'Bebidas', 'Pizzas', 'Salads', 'Ensaladas');

-- Add index for faster queries on custom categories
CREATE INDEX IF NOT EXISTS idx_categories_custom ON categories(tenant_id, is_custom);
