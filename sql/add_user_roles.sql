-- Add role and location_id to users table
-- Run this in Supabase SQL Editor BEFORE seed_test_data.sql

-- Add role column
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'waiter';
-- Possible values: 'tenant_admin', 'manager', 'waiter'

-- Add location_id for location-specific users (managers and waiters)
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_id INTEGER REFERENCES locations(id);
-- NULL = tenant_admin (access all locations)
-- Specific ID = manager or waiter (access only that location)

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location_id);

-- Update existing test user to be tenant_admin
UPDATE users SET role = 'tenant_admin', location_id = NULL WHERE email = 'admin@test.com';

-- Verify the changes
SELECT 
    'Migration completed successfully!' as status,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') as role_column_exists,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'location_id') as location_id_column_exists;
