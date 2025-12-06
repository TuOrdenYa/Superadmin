-- Add slug column to tenants table
-- Run this in Supabase SQL Editor

ALTER TABLE tenants ADD COLUMN IF NOT EXISTS slug VARCHAR(100) UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);

-- Update existing tenant with slug (if you have tenant_id=1)
UPDATE tenants SET slug = 'demo-restaurant' WHERE id = 1;
