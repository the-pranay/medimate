// Test duplicate email registration
async function testDuplicateRegistration() {
  const testData = {
    name: "Another User",
    email: "testuser1751627455131@example.com", // Using the same email from first test
    password: "password123",
    phone: "5555555555",
    role: "patient",
    age: "30",
    gender: "female",
    address: "789 Another St"
  };

  try {
    console.log('🧪 Testing duplicate email registration...');
    
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
      console.log('⚠️ Unexpected: Duplicate registration succeeded!');
    } else {
      console.log('✅ Expected: Duplicate registration blocked:', result.message);
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testDuplicateRegistration();
