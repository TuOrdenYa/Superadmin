// Send welcome email using Brevo REST API (templateId: 3)
export async function sendWelcomeEmail({
  email,
  name,
  restaurant,
  loginLink
}: {
  email: string;
  name: string;
  restaurant: string;
  loginLink: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!apiKey) throw new Error('Missing BREVO_API_KEY');
  if (!baseUrl || (process.env.NODE_ENV === 'production' && baseUrl.includes('localhost'))) {
    throw new Error('Invalid NEXT_PUBLIC_BASE_URL: must be set to your production domain in production.');
  }
  const sender = { email: 'no-reply@tuordenya.com', name: 'TuOrdenYa' };
  const payload = {
    sender,
    to: [{ email }],
    templateId: 3,
    params: {
      NAME: name,
      RESTAURANT: restaurant,
      EMAIL: email,
      LOGIN_LINK: loginLink
    }
  };
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Brevo welcome email failed: ${error}`);
  }
}
// Password policy: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
export function isPasswordStrong(password: string): boolean {
  return (
    typeof password === 'string' &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { query } from './db';
// Get user by email (case-insensitive, trims)
export async function getUserByEmail(email: string) {
  const res = await query(
    `SELECT * FROM users WHERE lower(btrim(email)) = lower(btrim($1)) LIMIT 1`,
    [email]
  );
  return res.rows[0] || null;
}

// Create a password reset token for a user (expires in 1 hour)
export async function createPasswordResetToken(user_id: number): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await query(
    `INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
    [user_id, token, expires]
  );
  return token;
}

// Send password reset email using Brevo REST API (no SDK)
export async function sendPasswordResetEmail(email: string, token: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!apiKey) throw new Error('Missing BREVO_API_KEY');
  if (!baseUrl || (process.env.NODE_ENV === 'production' && baseUrl.includes('localhost'))) {
    throw new Error('Invalid NEXT_PUBLIC_BASE_URL: must be set to your production domain in production.');
  }
  // Fetch user info for personalization (fallback to email if not found)
  let userName = email, restaurantName = '', userEmail = email;
  try {
    const user = await getUserByEmail(email);
    if (user) {
      userName = user.full_name || email;
      userEmail = user.email;
      // Fetch tenant name using tenant_id
      if (user.tenant_id) {
        const tenantRes = await query('SELECT name FROM tenants WHERE id = $1 LIMIT 1', [user.tenant_id]);
        if (tenantRes.rows && tenantRes.rows.length > 0) {
          restaurantName = tenantRes.rows[0].name;
        }
      }
    }
  } catch {}
  const resetUrl = `${baseUrl}/backoffice/reset-password?token=${token}`;
  const sender = { email: 'no-reply@tuordenya.com', name: 'TuOrdenYa' };
  const payload = {
    sender,
    to: [{ email }],
    templateId: 2,
    params: {
      NAME: userName,
      RESTAURANT: restaurantName,
      EMAIL: userEmail,
      RESET_LINK: resetUrl
    }
  };
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Brevo email failed: ${error}`);
  }
}

// Verify a password reset token and return user_id if valid
export async function verifyPasswordResetToken(token: string): Promise<number | null> {
  const res = await query(
    `SELECT user_id, expires_at, used FROM password_reset_tokens WHERE token = $1 LIMIT 1`,
    [token]
  );
  const row = res.rows[0];
  if (!row || row.used || new Date(row.expires_at) < new Date()) return null;
  return row.user_id;
}

// Invalidate a password reset token after use
export async function invalidatePasswordResetToken(token: string) {
  await query(
    `UPDATE password_reset_tokens SET used = TRUE WHERE token = $1`,
    [token]
  );
}

// Update user password (hashes new password)
export async function updateUserPassword(user_id: number, password: string) {
  const hash = await hashPassword(password);
  await query(
    `UPDATE users SET password_hash = $1 WHERE id = $2`,
    [hash, user_id]
  );
}

// Alias for password policy
export function passwordMeetsPolicy(password: string): boolean {
  return isPasswordStrong(password);
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const SALT_ROUNDS = 10;

export interface JWTPayload {
  uid: number;
  tenant_id: number;
  role: 'admin' | 'manager' | 'staff';
  location_id?: number | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getTokenFromHeader(authorization?: string): string | null {
  if (!authorization) return null;
  const parts = authorization.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}
