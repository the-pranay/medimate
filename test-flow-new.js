const test = async () => {
  try {
    console.log('🧪 Testing Registration to Dashboard Flow...');
    
    // Test 1: Clean registration
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dr. Test FlowCheck',
        email: 'flowcheck' + Date.now() + '@test.com',
        password: 'password123',
        phone: '1234567890',
        role: 'doctor',
        specialization: 'General Medicine',
        licenseNumber: 'LIC' + Date.now(),
        experience: 10,
        qualifications: [
          { degree: 'MD', institute: 'Medical College', year: 2020 },
          { degree: 'MBBS', institute: 'Medical College', year: 2018 }
        ]
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('📋 Full registration response:', registerData);
    console.log('✅ Registration:', registerData.success ? 'SUCCESS' : 'FAILED');
    
    if (registerData.success) {
      console.log('🔑 Token:', registerData.data?.token || 'N/A');
      console.log('👤 User:', registerData.data?.user?.name || 'N/A', '(' + (registerData.data?.user?.role || 'N/A') + ')');
      
      // Test 2: Profile API with the token
      const profileResponse = await fetch('http://localhost:3000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${registerData.data.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const profileData = await profileResponse.json();
      console.log('✅ Profile API:', profileData.success ? 'SUCCESS' : 'FAILED');
      
      if (profileData.success) {
        console.log('👩‍⚕️ Profile:', profileData.data.name, '(' + profileData.data.role + ')');
        
        // Test 3: Check if doctor dashboard would work
        if (profileData.data.role === 'doctor') {
          console.log('🎯 Doctor Dashboard: READY TO LOAD');
          console.log('📋 Summary:');
          console.log('  - Registration: ✅ Working');
          console.log('  - Token: ✅ Valid');
          console.log('  - Profile API: ✅ Working');
          console.log('  - User Role: ✅ Doctor');
          console.log('  - Dashboard: ✅ Should work!');
        } else {
          console.log('❌ Wrong role:', profileData.data.role);
        }
      } else {
        console.log('❌ Profile API failed:', profileData.message);
      }
    } else {
      console.log('❌ Registration failed:', registerData.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

test();
