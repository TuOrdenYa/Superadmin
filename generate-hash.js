import bcrypt from 'bcrypt';

async function generateHash() {
  const password = 'password123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('\n📝 Password Hash Generator\n');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\n📋 SQL to update user in Supabase:\n');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@test.com';`);
  console.log('\n');
}

generateHash();
