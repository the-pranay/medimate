import bcrypt from 'bcryptjs';

async function generateHash() {
  const password = 'demo123';
  const hash = await bcrypt.hash(password, 12);
  console.log('Password hash for "demo123":', hash);
}

generateHash();
