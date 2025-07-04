const testDashboardFlow = async () => {
  console.log('🚀 Starting comprehensive dashboard test...\n');

  // Test 1: Doctor registration and dashboard access
  console.log('=== DOCTOR REGISTRATION TEST ===');
  const doctorData = {
    name: "Dr. Jane Smith",
    email: "jane.smith@medimate.com",
    password: "doctor123",
    phone: "9876543210",
    role: "doctor",
    age: 42,
    gender: "female",
    address: "789 Medical Center Ave",
    specialization: "Pediatrics",
    experience: 15,
    licenseNumber: "LIC789012"
  };

  try {
    // Register doctor
    const doctorRegResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctorData)
    });

    const doctorRegResult = await doctorRegResponse.json();
    console.log('Doctor registration:', doctorRegResult.success ? '✅ SUCCESS' : '❌ FAILED');
    
    if (doctorRegResult.success) {
      const doctorToken = doctorRegResult.data.token;
      console.log('Doctor Token:', doctorToken.substring(0, 20) + '...');
      
      // Test doctor profile fetch
      const doctorProfileResponse = await fetch('http://localhost:3000/api/users/profile', {
        headers: { 'Authorization': `Bearer ${doctorToken}` }
      });
      
      const doctorProfile = await doctorProfileResponse.json();
      console.log('Doctor profile fetch:', doctorProfile.success ? '✅ SUCCESS' : '❌ FAILED');
      
      if (doctorProfile.success) {
        console.log('Doctor data validation:');
        console.log('  Name:', doctorProfile.data.name);
        console.log('  Specialization:', doctorProfile.data.specialization);
        console.log('  Experience:', doctorProfile.data.experience);
        console.log('  License:', doctorProfile.data.licenseNumber);
        console.log('  Age:', doctorProfile.data.age);
        console.log('  Gender:', doctorProfile.data.gender);
      }
      
      // Test appointments fetch for doctor
      const doctorAppointmentsResponse = await fetch('http://localhost:3000/api/appointments', {
        headers: { 'Authorization': `Bearer ${doctorToken}` }
      });
      
      const doctorAppointments = await doctorAppointmentsResponse.json();
      console.log('Doctor appointments fetch:', doctorAppointments.success ? '✅ SUCCESS' : '❌ FAILED');
      console.log('Doctor appointments count:', (doctorAppointments.data || []).length);
    }
    
  } catch (error) {
    console.error('❌ Doctor test failed:', error.message);
  }

  console.log('\n=== PATIENT REGISTRATION TEST ===');
  const patientData = {
    name: "John Doe",
    email: "john.doe@medimate.com",
    password: "patient123",
    phone: "5555555555",
    role: "patient",
    age: 28,
    gender: "male",
    address: "456 Patient Street",
    bloodGroup: "O+"
  };

  try {
    // Register patient
    const patientRegResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });

    const patientRegResult = await patientRegResponse.json();
    console.log('Patient registration:', patientRegResult.success ? '✅ SUCCESS' : '❌ FAILED');
    
    if (patientRegResult.success) {
      const patientToken = patientRegResult.data.token;
      console.log('Patient Token:', patientToken.substring(0, 20) + '...');
      
      // Test patient profile fetch
      const patientProfileResponse = await fetch('http://localhost:3000/api/users/profile', {
        headers: { 'Authorization': `Bearer ${patientToken}` }
      });
      
      const patientProfile = await patientProfileResponse.json();
      console.log('Patient profile fetch:', patientProfile.success ? '✅ SUCCESS' : '❌ FAILED');
      
      if (patientProfile.success) {
        console.log('Patient data validation:');
        console.log('  Name:', patientProfile.data.name);
        console.log('  Age:', patientProfile.data.age);
        console.log('  Gender:', patientProfile.data.gender);
        console.log('  Blood Group:', patientProfile.data.bloodGroup);
      }
      
      // Test appointments fetch for patient
      const patientAppointmentsResponse = await fetch('http://localhost:3000/api/appointments', {
        headers: { 'Authorization': `Bearer ${patientToken}` }
      });
      
      const patientAppointments = await patientAppointmentsResponse.json();
      console.log('Patient appointments fetch:', patientAppointments.success ? '✅ SUCCESS' : '❌ FAILED');
      console.log('Patient appointments count:', (patientAppointments.data || []).length);
    }
    
  } catch (error) {
    console.error('❌ Patient test failed:', error.message);
  }

  console.log('\n=== DOCTORS LIST TEST ===');
  try {
    // Test doctors list fetch
    const doctorsResponse = await fetch('http://localhost:3000/api/appointments/doctors');
    const doctorsResult = await doctorsResponse.json();
    
    console.log('Doctors list fetch:', doctorsResult.success ? '✅ SUCCESS' : '❌ FAILED');
    console.log('Total doctors found:', (doctorsResult.data || []).length);
    
    if (doctorsResult.success && doctorsResult.data.length > 0) {
      console.log('First doctor data:');
      const firstDoctor = doctorsResult.data[0];
      console.log('  Name:', firstDoctor.name);
      console.log('  Specialization:', firstDoctor.specialization);
      console.log('  Experience:', firstDoctor.experience);
      console.log('  License:', firstDoctor.licenseNumber);
      console.log('  Rating:', firstDoctor.rating);
    }
    
  } catch (error) {
    console.error('❌ Doctors list test failed:', error.message);
  }

  console.log('\n=== DASHBOARD COMPATIBILITY TEST ===');
  try {
    // Test if all required fields are present for dashboard display
    const doctorsResponse = await fetch('http://localhost:3000/api/appointments/doctors');
    const doctorsResult = await doctorsResponse.json();
    
    if (doctorsResult.success && doctorsResult.data.length > 0) {
      console.log('Testing doctor objects for null-safety:');
      doctorsResult.data.forEach((doctor, index) => {
        console.log(`Doctor ${index + 1}:`);
        console.log('  Valid object:', doctor ? '✅' : '❌');
        console.log('  Has name:', doctor?.name ? '✅' : '❌');
        console.log('  Has specialization:', doctor?.specialization ? '✅' : '❌');
        console.log('  Has experience:', doctor?.experience !== undefined ? '✅' : '❌');
        console.log('  Has licenseNumber:', doctor?.licenseNumber ? '✅' : '❌');
        console.log('  Has rating:', doctor?.rating !== undefined ? '✅' : '❌');
        console.log('  Has age:', doctor?.age !== undefined ? '✅' : '❌');
        console.log('  Has gender:', doctor?.gender ? '✅' : '❌');
        console.log('  ---');
      });
    }
    
  } catch (error) {
    console.error('❌ Dashboard compatibility test failed:', error.message);
  }

  console.log('\n🎉 Dashboard test completed!');
};

testDashboardFlow();
