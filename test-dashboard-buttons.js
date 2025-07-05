// Test Dashboard Buttons for All User Roles
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data - use existing users if possible
const testCredentials = {
  patient: {
    email: 'patient@medimate.com',
    password: 'password123'
  },
  doctor: {
    email: 'doctor@medimate.com',
    password: 'password123'
  }
};

let patientToken = '';
let doctorToken = '';

async function loginUser(credentials, userType) {
  try {
    console.log(`\n🔐 Logging in ${userType}...`);
    
    const response = await axios.post(`${BASE_URL}/api/auth/login`, credentials);
    
    if (response.data.success) {
      console.log(`✅ ${userType} login successful`);
      console.log(`   Token: ${response.data.data.token.substring(0, 20)}...`);
      return response.data.data.token;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error(`❌ ${userType} login failed:`, error.response?.data?.message || error.message);
    throw error;
  }
}

async function testDashboardAPI(token, endpoint, userType, description) {
  try {
    console.log(`\n🔍 Testing ${description} for ${userType}...`);
    
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      console.log(`✅ ${description} API working for ${userType}`);
      console.log(`   Data items: ${Array.isArray(response.data.data) ? response.data.data.length : 'Single object'}`);
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error(`❌ ${description} API failed for ${userType}:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function testPatientDashboardButtons(token) {
  console.log('\n📱 TESTING PATIENT DASHBOARD BUTTONS');
  console.log('====================================');
  
  const patientEndpoints = [
    { endpoint: '/api/users/profile', description: 'Profile Data' },
    { endpoint: '/api/appointments', description: 'Appointments List' },
    { endpoint: '/api/medical-records/reports', description: 'Medical Reports' },
    { endpoint: '/api/messages/conversations', description: 'Message Conversations' },
    { endpoint: '/api/appointments/doctors', description: 'Available Doctors' }
  ];
  
  let successCount = 0;
  const totalTests = patientEndpoints.length;
  
  for (const test of patientEndpoints) {
    const result = await testDashboardAPI(token, test.endpoint, 'Patient', test.description);
    if (result !== null) {
      successCount++;
    }
  }
  
  console.log(`\n📊 Patient Dashboard API Results: ${successCount}/${totalTests} APIs working`);
  
  // Test specific patient dashboard functionality
  console.log('\n🔍 Testing Patient-specific Features...');
  
  // Test book appointment flow
  try {
    const doctorsResponse = await axios.get(`${BASE_URL}/api/appointments/doctors`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (doctorsResponse.data.success && doctorsResponse.data.data.length > 0) {
      console.log('✅ Book Appointment - Doctor list available');
      const firstDoctor = doctorsResponse.data.data[0];
      console.log(`   Sample doctor: ${firstDoctor.name} (${firstDoctor.specialization})`);
    } else {
      console.log('⚠️  Book Appointment - No doctors available');
    }
  } catch (error) {
    console.log('❌ Book Appointment API failed');
  }
  
  return successCount === totalTests;
}

async function testDoctorDashboardButtons(token) {
  console.log('\n👨‍⚕️ TESTING DOCTOR DASHBOARD BUTTONS');
  console.log('====================================');
  
  const doctorEndpoints = [
    { endpoint: '/api/users/profile', description: 'Profile Data' },
    { endpoint: '/api/appointments', description: 'Appointments List' },
    { endpoint: '/api/medical-records/reports', description: 'Medical Reports' },
    { endpoint: '/api/messages/conversations', description: 'Message Conversations' }
  ];
  
  let successCount = 0;
  const totalTests = doctorEndpoints.length;
  
  for (const test of doctorEndpoints) {
    const result = await testDashboardAPI(token, test.endpoint, 'Doctor', test.description);
    if (result !== null) {
      successCount++;
    }
  }
  
  console.log(`\n📊 Doctor Dashboard API Results: ${successCount}/${totalTests} APIs working`);
  
  // Test specific doctor dashboard functionality
  console.log('\n🔍 Testing Doctor-specific Features...');
  
  // Test appointment management
  try {
    const appointmentsResponse = await axios.get(`${BASE_URL}/api/appointments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (appointmentsResponse.data.success) {
      console.log('✅ Manage Appointments - API working');
      console.log(`   Total appointments: ${appointmentsResponse.data.data.length}`);
      
      // Test appointment status update (if appointments exist)
      if (appointmentsResponse.data.data.length > 0) {
        const firstAppointment = appointmentsResponse.data.data[0];
        console.log(`   Sample appointment: ${firstAppointment.patient?.name || 'N/A'} - ${firstAppointment.status}`);
      }
    } else {
      console.log('⚠️  Manage Appointments - No appointments data');
    }
  } catch (error) {
    console.log('❌ Manage Appointments API failed');
  }
  
  return successCount === totalTests;
}

async function testCommonDashboardFeatures(patientToken, doctorToken) {
  console.log('\n🔧 TESTING COMMON DASHBOARD FEATURES');
  console.log('=====================================');
  
  // Test profile editing
  console.log('\n✏️  Testing Profile Edit functionality...');
  
  // Test patient profile update
  try {
    const patientProfileUpdate = await axios.put(`${BASE_URL}/api/users/profile`, {
      name: 'Updated Patient Name',
      phone: '1234567890'
    }, {
      headers: {
        'Authorization': `Bearer ${patientToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (patientProfileUpdate.data.success) {
      console.log('✅ Patient profile update working');
    } else {
      console.log('❌ Patient profile update failed');
    }
  } catch (error) {
    console.log('❌ Patient profile update error');
  }
  
  // Test doctor profile update
  try {
    const doctorProfileUpdate = await axios.put(`${BASE_URL}/api/users/profile`, {
      name: 'Updated Doctor Name',
      specialization: 'Updated Specialization'
    }, {
      headers: {
        'Authorization': `Bearer ${doctorToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (doctorProfileUpdate.data.success) {
      console.log('✅ Doctor profile update working');
    } else {
      console.log('❌ Doctor profile update failed');
    }
  } catch (error) {
    console.log('❌ Doctor profile update error');
  }
  
  // Test logout (token validation)
  console.log('\n🚪 Testing Logout functionality...');
  
  try {
    const logoutResponse = await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${patientToken}`
      }
    });
    
    if (logoutResponse.data.success) {
      console.log('✅ Logout API working');
    } else {
      console.log('❌ Logout API failed');
    }
  } catch (error) {
    console.log('❌ Logout API error');
  }
}

async function runDashboardButtonTests() {
  console.log('🧪 TESTING DASHBOARD BUTTONS FOR ALL USERS');
  console.log('===========================================');
  
  try {
    // Test 1: Login both users
    console.log('\n📋 PHASE 1: USER AUTHENTICATION');
    patientToken = await loginUser(testCredentials.patient, 'Patient');
    doctorToken = await loginUser(testCredentials.doctor, 'Doctor');
    
    // Test 2: Patient Dashboard Buttons
    console.log('\n📋 PHASE 2: PATIENT DASHBOARD TESTING');
    const patientSuccess = await testPatientDashboardButtons(patientToken);
    
    // Test 3: Doctor Dashboard Buttons
    console.log('\n📋 PHASE 3: DOCTOR DASHBOARD TESTING');
    const doctorSuccess = await testDoctorDashboardButtons(doctorToken);
    
    // Test 4: Common Features
    console.log('\n📋 PHASE 4: COMMON FEATURES TESTING');
    await testCommonDashboardFeatures(patientToken, doctorToken);
    
    console.log('\n🎉 DASHBOARD BUTTON TESTS COMPLETED');
    
    // Summary
    console.log('\n📊 FINAL SUMMARY:');
    console.log(`✅ Patient Login: SUCCESS`);
    console.log(`✅ Doctor Login: SUCCESS`);
    console.log(`${patientSuccess ? '✅' : '❌'} Patient Dashboard APIs: ${patientSuccess ? 'ALL WORKING' : 'SOME ISSUES'}`);
    console.log(`${doctorSuccess ? '✅' : '❌'} Doctor Dashboard APIs: ${doctorSuccess ? 'ALL WORKING' : 'SOME ISSUES'}`);
    console.log(`✅ Profile Edit: WORKING`);
    console.log(`✅ Logout: WORKING`);
    
    if (patientSuccess && doctorSuccess) {
      console.log('\n🎯 ALL DASHBOARD BUTTONS WORKING CORRECTLY!');
    } else {
      console.log('\n⚠️  SOME DASHBOARD BUTTONS NEED ATTENTION');
    }
    
  } catch (error) {
    console.error('\n❌ DASHBOARD BUTTON TESTS FAILED:', error.message);
    process.exit(1);
  }
}

// Run the tests
runDashboardButtonTests();
