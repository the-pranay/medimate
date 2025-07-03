import crypto from 'crypto';

// Generate secure encryption keys
console.log('🔐 Generating Secure Keys for MediMate\n');

console.log('JWT_SECRET:');
console.log(crypto.randomBytes(64).toString('hex'));

console.log('\nNEXTAUTH_SECRET:');
console.log(crypto.randomBytes(64).toString('hex'));

console.log('\nMEDICAL_DATA_ENCRYPTION_KEY:');
console.log(crypto.randomBytes(32).toString('hex'));

console.log('\nFILE_ENCRYPTION_KEY:');
console.log(crypto.randomBytes(32).toString('hex'));

console.log('\n✅ Copy these keys to your .env.local file');
console.log('⚠️  Keep these keys secure and never share them!');
