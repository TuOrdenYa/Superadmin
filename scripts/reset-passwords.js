/**
 * Generate SQL to update user passwords with fresh bcrypt hashes
 * Usage: node scripts/reset-passwords.js
 */

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'password123';

async function generateHash(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function generatePasswordResetSQL() {
  console.log('🔐 Generating bcrypt hash for password...');
  const passwordHash = await generateHash(DEFAULT_PASSWORD);
  console.log(`✓ Hash generated: ${passwordHash}\n`);

  console.log('📋 Copy and paste this SQL into Supabase SQL Editor:\n');
  console.log('─'.repeat(80));
  console.log(`-- Reset all test user passwords to: ${DEFAULT_PASSWORD}`);
  console.log(`-- Generated: ${new Date().toISOString()}`);
  console.log('');
  console.log('UPDATE users');
  console.log(`SET password_hash = '${passwordHash}'`);
  console.log('WHERE email IN (');
  console.log("    'admin@pizzaparadise.com',");
  console.log("    'manager.downtown@pizzaparadise.com',");
  console.log("    'manager.westside@pizzaparadise.com',");
  console.log("    'waiter1@pizzaparadise.com',");
  console.log("    'waiter2@pizzaparadise.com',");
  console.log("    'admin@burgerblast.com',");
  console.log("    'manager.main@burgerblast.com',");
  console.log("    'manager.mall@burgerblast.com',");
  console.log("    'waiter.main@burgerblast.com',");
  console.log("    'waiter.mall@burgerblast.com'");
  console.log(');');
  console.log('');
  console.log('-- Verify the update');
  console.log('SELECT email, full_name, role,');
  console.log(`       CASE WHEN password_hash = '${passwordHash}'`);
  console.log("            THEN 'Updated ✓'");
  console.log("            ELSE 'Old hash'");
  console.log('       END as hash_status');
  console.log('FROM users');
  console.log('WHERE tenant_id IN (1, 2)');
  console.log('ORDER BY tenant_id, role, email;');
  console.log('─'.repeat(80));
  console.log('');
  console.log('✅ SQL generated! All users will have password:', DEFAULT_PASSWORD);
}

generatePasswordResetSQL().catch(console.error);
