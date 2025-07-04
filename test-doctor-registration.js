// Test doctor registration
async function testDoctorRegistration() {
  const testData = {
    name: "Dr. John Smith",
    email: "doctor" + Date.now() + "@example.com",
    password: "password123",
    phone: "9876543210",
    role: "doctor",
    age: "35",
    gender: "male",
    address: "456 Medical Center",
    specialization: "Cardiology",
    experience: "10",
    licenseNumber: "MD123456"
  };

  try {
    console.log('🧪 Testing doctor registration with data:', {...testData, password: '[HIDDEN]'});
    
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
      console.log('✅ Doctor registration successful!');
      console.log('👨‍⚕️ Doctor ID:', result.data.user._id);
      console.log('🏥 Specialization:', result.data.user.specialization);
    } else {
      console.log('❌ Doctor registration failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testDoctorRegistration();
