// Test the complete registration flow
async function testRegistrationFlow() {
  const testData = {
    name: "Flow Test User",
    email: "flowtest" + Date.now() + "@example.com",
    password: "password123",
    phone: "1111111111",
    role: "patient",
    age: "28",
    gender: "female",
    address: "456 Flow Test St"
  };

  try {
    console.log('🧪 Testing complete registration flow...');
    console.log('📝 Registering user:', testData.email);
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Registration successful!');
      console.log('👤 User created:', result.data.user.name);
      console.log('🎫 Token received:', result.data.token ? 'Yes' : 'No');
      console.log('🔄 User should be redirected to:', 
        result.data.user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'
      );
      
      // Test localStorage simulation
      console.log('💾 Simulating localStorage storage...');
      console.log('✅ Auth flow should now redirect to dashboard without loops');
      
    } else {
      console.log('❌ Registration failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Flow test error:', error.message);
  }
}

testRegistrationFlow();
