// Test password hashing
import bcrypt from 'bcryptjs';

async function testPasswordHash() {
  const password = 'demo123';
  const hash = '$2a$12$OrwUEPscqSOsF76sE5U2N./iv/X6xMHC1PKDGJDKqKPLIHAM2nBly';
  
  console.log('Testing password:', password);
  console.log('Against hash:', hash);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('Is valid:', isValid);
  
  // Generate a new hash to compare
  const newHash = await bcrypt.hash(password, 12);
  console.log('New hash:', newHash);
}

testPasswordHash();
