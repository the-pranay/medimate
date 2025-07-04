const testPatientRegistration = async () => {
  const patientData = {
    name: "Test Patient",
    email: "test.patient@test.com",
    password: "testpass123",
    phone: "1234567890",
    role: "patient",
    age: 25,
    gender: "female",
    address: "456 Test Avenue",
    bloodGroup: "A+"
  };

  try {
    console.log('Testing patient registration...');
    console.log('Data being sent:', JSON.stringify(patientData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData)
    });

    const result = await response.json();
    console.log('Registration Response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ Patient registration successful!');
      console.log('User ID:', result.data.user._id);
      console.log('User Role:', result.data.user.role);
      console.log('User Name:', result.data.user.name);
      console.log('User Age:', result.data.user.age);
      console.log('User Gender:', result.data.user.gender);
      console.log('User Blood Group:', result.data.user.bloodGroup);
      
      // Test profile fetch
      console.log('\n--- Testing Profile Fetch ---');
      const profileResponse = await fetch('http://localhost:3000/api/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${result.data.token}`,
          'Content-Type': 'application/json',
        }
      });
      
      const profileResult = await profileResponse.json();
      console.log('Profile Response:', JSON.stringify(profileResult, null, 2));
      
      if (profileResult.success) {
        console.log('✅ Profile fetch successful!');
        console.log('Profile Name:', profileResult.data.name);
        console.log('Profile Age:', profileResult.data.age);
        console.log('Profile Gender:', profileResult.data.gender);
        console.log('Profile Blood Group:', profileResult.data.bloodGroup);
      } else {
        console.log('❌ Profile fetch failed:', profileResult.message);
      }
    } else {
      console.log('❌ Registration failed:', result.message);
    }

  } catch (error) {
    console.error('Error during registration test:', error);
  }
};

testPatientRegistration();
