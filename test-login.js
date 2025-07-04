// Test login functionality
async function testLogin() {
  const loginData = {
    email: "testuser1751627455131@example.com", // Using registered user
    password: "password123"
  };

  try {
    console.log('🧪 Testing login with:', loginData.email);
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const result = await response.json();
    console.log('📡 Response status:', response.status);
    console.log('📋 Response data:', result);
    
    if (result.success) {
      console.log('✅ Login successful!');
      console.log('👤 User ID:', result.data.user._id);
      console.log('👥 User Role:', result.data.user.role);
      console.log('🔑 Token received:', result.data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Login failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testLogin();
