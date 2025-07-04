const testDoctorRegistration = async () => {
  const doctorData = {
    name: "Dr. Test Doctor",
    email: "test.doctor@test.com",
    password: "testpass123",
    phone: "1234567890",
    role: "doctor",
    age: 35,
    gender: "male",
    address: "123 Test Street",
    specialization: "Cardiology",
    experience: 10,
    licenseNumber: "LIC123456"
  };

  try {
    console.log('Testing doctor registration...');
    console.log('Data being sent:', JSON.stringify(doctorData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData)
    });

    const result = await response.json();
    console.log('Registration Response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ Registration successful!');
      console.log('User ID:', result.data.user._id);
      console.log('User Role:', result.data.user.role);
      console.log('User Name:', result.data.user.name);
      console.log('User Specialization:', result.data.user.specialization);
      console.log('User Experience:', result.data.user.experience);
      console.log('User License Number:', result.data.user.licenseNumber);
      
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
        console.log('Profile Specialization:', profileResult.data.specialization);
        console.log('Profile Experience:', profileResult.data.experience);
        console.log('Profile License Number:', profileResult.data.licenseNumber);
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

testDoctorRegistration();
