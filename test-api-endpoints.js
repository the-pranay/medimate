// API Endpoint Testing Script
const BASE_URL = 'http://localhost:3001';

async function testDoctorsAPI() {
  try {
    console.log('🧪 Testing Doctors API...');
    const response = await fetch(`${BASE_URL}/api/appointments/doctors`);
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.ok && data.success) {
      console.log('✅ Doctors API working correctly');
      console.log(`Found ${data.data?.length || 0} doctors`);
    } else {
      console.log('❌ Doctors API issue:', data.message);
    }
  } catch (error) {
    console.error('❌ Doctors API error:', error.message);
  }
}

async function testAppointmentCreation() {
  console.log('\n🧪 Testing Appointment Creation (without auth - should fail)...');
  try {
    const response = await fetch(`${BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorId: 'test_doctor_id',
        date: '2025-01-10',
        time: '10:00 AM',
        reasonForVisit: 'Test appointment'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.status === 401) {
      console.log('✅ Authentication check working correctly');
    } else {
      console.log('❌ Authentication issue');
    }
  } catch (error) {
    console.error('❌ Appointment API error:', error.message);
  }
}

async function runAPITests() {
  await testDoctorsAPI();
  await testAppointmentCreation();
  console.log('\n✅ API Testing completed!');
}

runAPITests().catch(console.error);
