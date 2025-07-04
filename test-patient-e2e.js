// End-to-end patient registration test
const testPatientRegistrationEndToEnd = async () => {
  console.log('🧪 Testing Patient Registration End-to-End...\n');
  
  try {
    const uniqueId = Date.now();
    const patientData = {
      name: 'Jane E2E Test Patient',
      email: `patient.e2e${uniqueId}@test.com`,
      password: 'password123',
      confirmPassword: 'password123',
      phone: '9876543210',
      role: 'patient',
      age: '25',
      gender: 'female',
      address: '456 E2E Test Street, Test City'
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
      console.log(`   → Email: ${result.data.user.email}`);
      console.log(`   → Age: ${result.data.user.age}`);
      console.log(`   → Gender: ${result.data.user.gender}`);
      console.log(`   → Token: ${result.data.token?.substring(0, 50)}...`);
      
      // Test that the user can be found in the database
      console.log('\n🔍 Testing profile fetch...');
      const profileResponse = await fetch('http://localhost:3000/api/users/profile', {
        headers: { 'Authorization': `Bearer ${result.data.token}` }
      });
      
      const profileResult = await profileResponse.json();
      
      if (profileResult.success) {
        console.log('✅ Profile fetch successful!');
        console.log(`   → Name: ${profileResult.data.name}`);
        console.log(`   → Role: ${profileResult.data.role}`);
      } else {
        console.log('❌ Profile fetch failed:', profileResult.message);
      }
    } else {
      console.log('\n❌ Patient registration failed:');
      console.log(`   → Error: ${result.message}`);
    }
    
  } catch (error) {
    console.error('\n💥 Test failed with error:', error.message);
    console.error('Stack:', error.stack);
  }
};

testPatientRegistrationEndToEnd();
