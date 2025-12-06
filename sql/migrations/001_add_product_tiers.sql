-- Migration: Add product tier support to tenants table
-- This enables Light, Plus, and Pro subscription levels

-- Add product_tier column to tenants table
ALTER TABLE public.tenants 
ADD COLUMN product_tier VARCHAR(20) DEFAULT 'light' CHECK (product_tier IN ('light', 'plus', 'pro'));

-- Add subscription status and dates
ALTER TABLE public.tenants 
ADD COLUMN subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'trial', 'expired'));

ALTER TABLE public.tenants 
ADD COLUMN subscription_start_date TIMESTAMP DEFAULT NOW();

ALTER TABLE public.tenants 
ADD COLUMN subscription_end_date TIMESTAMP;

-- Add created_at and updated_at for tracking
ALTER TABLE public.tenants 
ADD COLUMN created_at TIMESTAMP DEFAULT NOW();

ALTER TABLE public.tenants 
ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- Create index for faster lookups
CREATE INDEX idx_tenants_product_tier ON public.tenants(product_tier);
CREATE INDEX idx_tenants_subscription_status ON public.tenants(subscription_status);

-- Update existing tenants to 'pro' tier (since they have all features already)
UPDATE public.tenants SET product_tier = 'pro' WHERE product_tier IS NULL;

-- Comment on columns
COMMENT ON COLUMN public.tenants.product_tier IS 'Subscription tier: light (menu+QR), plus (orders+reports), pro (full operation)';
COMMENT ON COLUMN public.tenants.subscription_status IS 'Current subscription status';
