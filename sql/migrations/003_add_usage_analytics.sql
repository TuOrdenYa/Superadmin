-- Usage Analytics tracking table
CREATE TABLE IF NOT EXISTS usage_analytics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  feature_name VARCHAR(100) NOT NULL,
  action_type VARCHAR(50) NOT NULL, -- 'view', 'create', 'update', 'delete', 'api_call'
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  metadata JSONB, -- Store additional context
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_usage_tenant_feature ON usage_analytics(tenant_id, feature_name, created_at DESC);
CREATE INDEX idx_usage_tenant_date ON usage_analytics(tenant_id, created_at DESC);

-- View for aggregated usage stats
CREATE OR REPLACE VIEW usage_stats AS
SELECT 
  tenant_id,
  feature_name,
  action_type,
  DATE(created_at) as date,
  COUNT(*) as usage_count
FROM usage_analytics
GROUP BY tenant_id, feature_name, action_type, DATE(created_at);
