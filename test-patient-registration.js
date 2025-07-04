// Test patient registration to identify the internal server error
const testPatientRegistration = async () => {
  console.log('🧪 Testing Patient Registration...\n');
  
  try {
    const uniqueId = Date.now();
    const patientData = {
      name: 'John Test Patient',
      email: `patient${uniqueId}@test.com`,
      password: 'password123',
      phone: '1234567890',
      role: 'patient',
      age: '30',
      gender: 'male',
      address: '123 Test Street, Test City'
    };
    
    console.log('📝 Sending patient registration data:');
    console.log(JSON.stringify(patientData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });
    
    const result = await response.json();
    
    console.log('\n📋 Response Status:', response.status);
    console.log('📋 Response Data:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ Patient registration successful!');
      console.log(`   → User: ${result.data.user.name} (${result.data.user.role})`);
      console.log(`   → Token: ${result.data.token?.substring(0, 50)}...`);
    } else {
      console.log('\n❌ Patient registration failed:');
      console.log(`   → Error: ${result.message}`);
    }
    
  } catch (error) {
    console.error('\n💥 Test failed with error:', error.message);
    console.error('Stack:', error.stack);
  }
};

testPatientRegistration();
