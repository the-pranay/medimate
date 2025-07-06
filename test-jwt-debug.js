// Debug JWT token verification
const jwt = require('jsonwebtoken');

const debugJWT = () => {
  console.log('🔍 JWT Debug Information...\n');
  
  // Check environment variables
  console.log('Environment Variables:');
  console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '[SET]' : '[NOT SET]');
  console.log('  NODE_ENV:', process.env.NODE_ENV);
  
  // Test JWT creation and verification
  const testSecret = process.env.JWT_SECRET || 'default_secret';
  console.log('\n  Using secret:', testSecret === 'default_secret' ? 'default_secret' : '[CUSTOM]');
  
  const testPayload = {
    userId: '507f1f77bcf86cd799439011',
    role: 'patient',
    email: 'patient@test.com'
  };
  
  console.log('\n1. Creating JWT token...');
  const token = jwt.sign(testPayload, testSecret, { expiresIn: '24h' });
  console.log('   Token created:', token.substring(0, 50) + '...');
  
  console.log('\n2. Verifying JWT token...');
  try {
    const decoded = jwt.verify(token, testSecret);
    console.log('   Verification successful!');
    console.log('   Decoded payload:', JSON.stringify(decoded, null, 2));
  } catch (error) {
    console.error('   Verification failed:', error.message);
  }
  
  console.log('\n3. Testing with Bearer prefix...');
  const bearerToken = `Bearer ${token}`;
  const tokenWithoutBearer = bearerToken.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(tokenWithoutBearer, testSecret);
    console.log('   Bearer token verification successful!');
    console.log('   Decoded payload:', JSON.stringify(decoded, null, 2));
  } catch (error) {
    console.error('   Bearer token verification failed:', error.message);
  }
  
  console.log('\n✅ JWT debug completed!');
};

debugJWT();
