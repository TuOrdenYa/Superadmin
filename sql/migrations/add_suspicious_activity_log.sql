-- Table for logging suspicious activity (failed logins, high request rates, etc.)
CREATE TABLE IF NOT EXISTS suspicious_activity_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    tenant_id INTEGER,
    email TEXT,
    ip_address TEXT,
    event_type TEXT NOT NULL, -- e.g., 'failed_login', 'rate_limit', etc.
    event_details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);