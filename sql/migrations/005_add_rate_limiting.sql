-- Rate limiting table for API request tracking
CREATE TABLE IF NOT EXISTS rate_limits (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  window_start TIMESTAMP NOT NULL,
  request_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, window_start)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_tenant_window ON rate_limits(tenant_id, window_start DESC);

-- Function to clean up old rate limit records (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits 
  WHERE window_start < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- View to see current rate limit status
CREATE OR REPLACE VIEW rate_limit_status AS
SELECT 
  rl.tenant_id,
  t.name as tenant_name,
  t.product_tier,
  rl.window_start,
  rl.request_count,
  CASE 
    WHEN t.product_tier = 'light' THEN 100
    WHEN t.product_tier = 'plus' THEN 500
    WHEN t.product_tier = 'pro' THEN 999999
    ELSE 100
  END as rate_limit,
  CASE 
    WHEN t.product_tier = 'pro' THEN false
    WHEN t.product_tier = 'plus' THEN rl.request_count >= 500
    ELSE rl.request_count >= 100
  END as is_limited
FROM rate_limits rl
JOIN tenants t ON t.id = rl.tenant_id
WHERE rl.window_start >= NOW() - INTERVAL '1 hour'
ORDER BY rl.request_count DESC;
