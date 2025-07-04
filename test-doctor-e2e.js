// End-to-end doctor registration test
const testDoctorRegistrationEndToEnd = async () => {
  console.log('🧪 Testing Doctor Registration End-to-End...\n');
  
  try {
    const uniqueId = Date.now();
    const doctorData = {
      name: 'Dr. John E2E Test Doctor',
      email: `doctor.e2e${uniqueId}@test.com`,
      password: 'password123',
      confirmPassword: 'password123',
      phone: '5555555555',
      role: 'doctor',
      age: '35',
      gender: 'male',
      address: '789 E2E Medical Center, Test City',
      specialization: 'Cardiology',
      experience: '10',
      licenseNumber: `LIC${uniqueId}`
    };
    
    console.log('📝 Sending doctor registration data:');
    console.log(JSON.stringify(doctorData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctorData)
    });
    
    const result = await response.json();
    
    console.log('\n📋 Response Status:', response.status);
    console.log('📋 Response Data:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ Doctor registration successful!');
      console.log(`   → User: ${result.data.user.name} (${result.data.user.role})`);
      console.log(`   → Email: ${result.data.user.email}`);
      console.log(`   → Specialization: ${result.data.user.specialization}`);
      console.log(`   → Experience: ${result.data.user.experience} years`);
      console.log(`   → License: ${result.data.user.licenseNumber}`);
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
        console.log(`   → Specialization: ${profileResult.data.specialization}`);
      } else {
        console.log('❌ Profile fetch failed:', profileResult.message);
      }
    } else {
      console.log('\n❌ Doctor registration failed:');
      console.log(`   → Error: ${result.message}`);
    }
    
  } catch (error) {
    console.error('\n💥 Test failed with error:', error.message);
    console.error('Stack:', error.stack);
  }
};

testDoctorRegistrationEndToEnd();
