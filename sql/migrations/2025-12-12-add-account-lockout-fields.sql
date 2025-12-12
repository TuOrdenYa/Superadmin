-- Migration: Add account lockout fields to users table
ALTER TABLE users
ADD COLUMN failed_login_attempts INTEGER NOT NULL DEFAULT 0,
ADD COLUMN lockout_until TIMESTAMP NULL;
