// Test registration endpoint
async function testRegistration() {
  const testData = {
    name: "Test User",
    email: "testuser" + Date.now() + "@example.com", // Use unique email
    password: "password123",
    phone: "1234567890",
    role: "patient",
    age: "25",
    gender: "male",
    address: "123 Test St"
  };

  try {
    console.log('🧪 Testing registration with data:', {...testData, password: '[HIDDEN]'});
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('📡 Response status:', response.status);
    console.log('📋 Response data:', result);
    
    if (result.success) {
      console.log('✅ Registration successful!');
      console.log('👤 User ID:', result.data.user._id);
      console.log('🔑 Token received:', result.data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Registration failed:', result.message);
      if (result.error) {
        console.log('🐛 Error details:', result.error);
      }
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testRegistration();
