const testAuthFlow = async () => {
  console.log('🔄 Testing complete auth flow...\n');

  // Test Doctor Registration
  console.log('=== DOCTOR REGISTRATION ===');
  const doctorData = {
    name: "Dr. Auth Test",
    email: "auth.test@doctor.com",
    password: "testauth123",
    phone: "3333333333",
    role: "doctor",
    age: 40,
    gender: "male",
    address: "123 Auth Test Street",
    specialization: "Neurology",
    experience: 12,
    licenseNumber: "LIC999888"
  };

  try {
    const doctorRegResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctorData)
    });

    const doctorRegResult = await doctorRegResponse.json();
    console.log('Doctor registration:', doctorRegResult.success ? '✅ SUCCESS' : '❌ FAILED');
    
    if (doctorRegResult.success) {
      console.log('Doctor user data validation:');
      console.log('  _id:', doctorRegResult.data.user._id ? '✅' : '❌');
      console.log('  name:', doctorRegResult.data.user.name ? '✅' : '❌');
      console.log('  email:', doctorRegResult.data.user.email ? '✅' : '❌');
      console.log('  role:', doctorRegResult.data.user.role ? '✅' : '❌');
      console.log('  specialization:', doctorRegResult.data.user.specialization ? '✅' : '❌');
      console.log('  experience:', doctorRegResult.data.user.experience !== undefined ? '✅' : '❌');
      console.log('  licenseNumber:', doctorRegResult.data.user.licenseNumber ? '✅' : '❌');
      console.log('  age:', doctorRegResult.data.user.age !== undefined ? '✅' : '❌');
      console.log('  gender:', doctorRegResult.data.user.gender ? '✅' : '❌');
      console.log('  token:', doctorRegResult.data.token ? '✅' : '❌');
    }

  } catch (error) {
    console.error('❌ Doctor registration error:', error.message);
  }

  // Test Patient Registration
  console.log('\n=== PATIENT REGISTRATION ===');
  const patientData = {
    name: "Patient Auth Test",
    email: "auth.test@patient.com",
    password: "testauth123",
    phone: "4444444444",
    role: "patient",
    age: 30,
    gender: "female",
    address: "456 Auth Test Avenue",
    bloodGroup: "B+"
  };

  try {
    const patientRegResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });

    const patientRegResult = await patientRegResponse.json();
    console.log('Patient registration:', patientRegResult.success ? '✅ SUCCESS' : '❌ FAILED');
    
    if (patientRegResult.success) {
      console.log('Patient user data validation:');
      console.log('  _id:', patientRegResult.data.user._id ? '✅' : '❌');
      console.log('  name:', patientRegResult.data.user.name ? '✅' : '❌');
      console.log('  email:', patientRegResult.data.user.email ? '✅' : '❌');
      console.log('  role:', patientRegResult.data.user.role ? '✅' : '❌');
      console.log('  age:', patientRegResult.data.user.age !== undefined ? '✅' : '❌');
      console.log('  gender:', patientRegResult.data.user.gender ? '✅' : '❌');
      console.log('  bloodGroup:', patientRegResult.data.user.bloodGroup ? '✅' : '❌');
      console.log('  token:', patientRegResult.data.token ? '✅' : '❌');
    }

  } catch (error) {
    console.error('❌ Patient registration error:', error.message);
  }

  // Test Login Flows
  console.log('\n=== LOGIN TESTS ===');
  
  // Test Doctor Login
  try {
    const doctorLoginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "auth.test@doctor.com", password: "testauth123" })
    });

    const doctorLoginResult = await doctorLoginResponse.json();
    console.log('Doctor login:', doctorLoginResult.success ? '✅ SUCCESS' : '❌ FAILED');
    
    if (doctorLoginResult.success) {
      console.log('Doctor login data validation:');
      console.log('  User object:', doctorLoginResult.data.user ? '✅' : '❌');
      console.log('  Token:', doctorLoginResult.data.token ? '✅' : '❌');
      console.log('  User role:', doctorLoginResult.data.user.role === 'doctor' ? '✅' : '❌');
    }

  } catch (error) {
    console.error('❌ Doctor login error:', error.message);
  }

  // Test Patient Login
  try {
    const patientLoginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "auth.test@patient.com", password: "testauth123" })
    });

    const patientLoginResult = await patientLoginResponse.json();
    console.log('Patient login:', patientLoginResult.success ? '✅ SUCCESS' : '❌ FAILED');
    
    if (patientLoginResult.success) {
      console.log('Patient login data validation:');
      console.log('  User object:', patientLoginResult.data.user ? '✅' : '❌');
      console.log('  Token:', patientLoginResult.data.token ? '✅' : '❌');
      console.log('  User role:', patientLoginResult.data.user.role === 'patient' ? '✅' : '❌');
    }

  } catch (error) {
    console.error('❌ Patient login error:', error.message);
  }

  console.log('\n🎉 Auth flow test completed!');
};

testAuthFlow();
