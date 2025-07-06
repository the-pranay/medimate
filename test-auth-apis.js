// Test script to debug the appointment API with proper authentication
const jwt = require('jsonwebtoken');

const testWithAuth = async () => {
  const baseURL = 'http://localhost:3001';
  
  console.log('🧪 Testing MediMate Appointment APIs with Authentication...\n');
  
  // Use the actual JWT_SECRET from environment
  const jwtSecret = '8daa06d33112bc1c05f0dd6c26ba0094d1de850d79f535fce13bdf37a04ec04710c306d60ba1b8cd4c0ec6d687a0e173f6acab554655bbaaf6cb53055e29fd619';
  
  // Create test tokens
  const patientToken = jwt.sign(
    { 
      userId: '507f1f77bcf86cd799439011', // Sample ObjectId
      role: 'patient',
      email: 'patient@test.com'
    },
    jwtSecret,
    { expiresIn: '24h' }
  );
  
  const doctorToken = jwt.sign(
    { 
      userId: '507f1f77bcf86cd799439012', // Sample ObjectId  
      role: 'doctor',
      email: 'doctor@test.com'
    },
    jwtSecret,
    { expiresIn: '24h' }
  );
  
  console.log('1. Testing Patient Appointments API with valid token...');
  try {
    const response = await fetch(`${baseURL}/api/appointments/patient`, {
      headers: {
        'Authorization': `Bearer ${patientToken}`
      }
    });
    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  console.log('\n2. Testing Doctor Appointments API with valid token...');
  try {
    const response = await fetch(`${baseURL}/api/appointments/doctor`, {
      headers: {
        'Authorization': `Bearer ${doctorToken}`
      }
    });
    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  console.log('\n✅ Authenticated API test completed!');
};

// Run the test
testWithAuth().catch(console.error);
