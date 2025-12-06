-- Set product tiers for testing tenants
-- Pizza Paradise (id=1) -> Pro
-- Burger place (id=2) -> Plus  
-- Popo -> Light

-- First, let's see what tenants exist
-- SELECT id, name, slug FROM tenants ORDER BY id;

-- Update Pizza Paradise to Pro (full features)
UPDATE public.tenants 
SET product_tier = 'pro',
    subscription_status = 'active',
    updated_at = NOW()
WHERE id = 1 OR name ILIKE '%pizza%';

-- Update Burger place to Plus (orders + reports, no tables/variants)
UPDATE public.tenants 
SET product_tier = 'plus',
    subscription_status = 'active',
    updated_at = NOW()
WHERE id = 2 OR name ILIKE '%burger%';

-- Update Popo to Light (menu + QR only)
UPDATE public.tenants 
SET product_tier = 'light',
    subscription_status = 'active',
    updated_at = NOW()
WHERE name ILIKE '%popo%';

-- Verify the changes
SELECT id, name, slug, product_tier, subscription_status 
FROM tenants 
ORDER BY id;
