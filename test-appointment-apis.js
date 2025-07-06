// Test script to debug the appointment API issues
const testAppointmentAPIs = async () => {
  const baseURL = 'http://localhost:3000';
  
  console.log('🧪 Testing MediMate Appointment APIs...\n');
  
  // Test without authentication first
  console.log('1. Testing Patient Appointments API (no auth)...');
  try {
    const response = await fetch(`${baseURL}/api/appointments/patient`);
    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  console.log('\n2. Testing Doctor Appointments API (no auth)...');
  try {
    const response = await fetch(`${baseURL}/api/appointments/doctor`);
    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test with fake token
  console.log('\n3. Testing Patient Appointments API (fake token)...');
  try {
    const response = await fetch(`${baseURL}/api/appointments/patient`, {
      headers: {
        'Authorization': 'Bearer fake-token'
      }
    });
    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  console.log('\n4. Testing Doctor Appointments API (fake token)...');
  try {
    const response = await fetch(`${baseURL}/api/appointments/doctor`, {
      headers: {
        'Authorization': 'Bearer fake-token'
      }
    });
    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  console.log('\n✅ API test completed!');
};

// Run the test
testAppointmentAPIs().catch(console.error);
