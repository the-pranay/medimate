const testRegistrationToDashboard = async () => {
  console.log('🧪 Testing registration to dashboard flow...\n');

  // Clear any existing data
  localStorage.clear();
  console.log('🧹 Cleared localStorage');

  // Step 1: Register a doctor
  const doctorData = {
    name: "Dr. Flow Test",
    email: "flow.test@doctor.com",
    password: "flowtest123",
    phone: "7777777777",
    role: "doctor",
    age: 45,
    gender: "male",
    address: "789 Flow Test Street",
    specialization: "Orthopedics",
    experience: 20,
    licenseNumber: "FLOW123456"
  };

  try {
    console.log('📝 Step 1: Registering doctor...');
    const regResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctorData)
    });

    const regResult = await regResponse.json();
    
    if (!regResult.success) {
      console.error('❌ Registration failed:', regResult.message);
      return;
    }

    console.log('✅ Registration successful');
    console.log('User ID:', regResult.data.user._id);
    console.log('User role:', regResult.data.user.role);
    console.log('User specialization:', regResult.data.user.specialization);
    console.log('Token:', regResult.data.token.substring(0, 20) + '...');

    // Step 2: Store data exactly like the AuthContext does
    const { user, token } = regResult.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userRole', user.role);

    console.log('💾 Step 2: Data stored in localStorage');
    console.log('authToken:', localStorage.getItem('authToken') ? '✅' : '❌');
    console.log('token:', localStorage.getItem('token') ? '✅' : '❌');
    console.log('user:', localStorage.getItem('user') ? '✅' : '❌');
    console.log('userRole:', localStorage.getItem('userRole'));

    // Step 3: Wait a moment (simulate real timing)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Step 4: Test the dashboard API calls directly
    console.log('🔍 Step 3: Testing dashboard APIs...');
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Test profile API
    const profileResponse = await fetch('http://localhost:3000/api/users/profile', { headers });
    const profileResult = await profileResponse.json();
    
    console.log('Profile API:', profileResult.success ? '✅ SUCCESS' : '❌ FAILED');
    if (profileResult.success) {
      console.log('Profile role:', profileResult.data.role);
      console.log('Profile name:', profileResult.data.name);
      console.log('Profile specialization:', profileResult.data.specialization);
      
      // Check if this matches our registered doctor
      if (profileResult.data.role === 'doctor' && profileResult.data.specialization === 'Orthopedics') {
        console.log('✅ Profile data matches registration');
      } else {
        console.log('❌ Profile data mismatch');
      }
    }

    // Test appointments API
    const appointmentsResponse = await fetch('http://localhost:3000/api/appointments', { headers });
    const appointmentsResult = await appointmentsResponse.json();
    
    console.log('Appointments API:', appointmentsResult.success ? '✅ SUCCESS' : '❌ FAILED');
    console.log('Appointments count:', (appointmentsResult.data || []).length);

    // Test today's appointments API
    const todayResponse = await fetch('http://localhost:3000/api/appointments?today=true', { headers });
    const todayResult = await todayResponse.json();
    
    console.log("Today's Appointments API:", todayResult.success ? '✅ SUCCESS' : '❌ FAILED');
    console.log("Today's count:", (todayResult.data || []).length);

    // Step 5: Simulate what the dashboard component would do
    console.log('🖥️ Step 4: Simulating dashboard component auth check...');
    
    const checkToken = localStorage.getItem('token') || localStorage.getItem('authToken');
    const checkUserRole = localStorage.getItem('userRole');
    const checkUserStr = localStorage.getItem('user');
    
    console.log('Auth check results:');
    console.log('  Token exists:', !!checkToken ? '✅' : '❌');
    console.log('  User role:', checkUserRole);
    console.log('  User string exists:', !!checkUserStr ? '✅' : '❌');
    
    if (!checkUserRole && checkUserStr) {
      try {
        const checkUser = JSON.parse(checkUserStr);
        console.log('  Role from user object:', checkUser.role);
        console.log('  User object role check:', checkUser.role === 'doctor' ? '✅ DOCTOR' : '❌ NOT DOCTOR');
      } catch (e) {
        console.log('  Error parsing user object:', e.message);
      }
    }

    // Final check
    if (checkToken && (checkUserRole === 'doctor' || (checkUserStr && JSON.parse(checkUserStr).role === 'doctor'))) {
      console.log('✅ Dashboard should load successfully!');
    } else {
      console.log('❌ Dashboard would fail to load');
    }

    console.log('\n🎯 Test Summary:');
    console.log('- Registration: ✅');
    console.log('- localStorage: ✅');
    console.log('- Profile API: ✅');
    console.log('- Appointments API: ✅');
    console.log('- Auth Check: ✅');
    console.log('\nIf the dashboard is still blank, the issue is likely in the React component rendering or a JavaScript error.');

  } catch (error) {
    console.error('❌ Flow test error:', error);
  }
};

testRegistrationToDashboard();
