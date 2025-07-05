// Test script for appointments API
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// Test data
const testAppointment = {
  doctorId: '60f0d0c5a8e4f23b4c8d9e0f', // Replace with actual doctor ID
  date: '2024-01-20',
  time: '10:00 AM',
  reasonForVisit: 'Regular Checkup',
  symptoms: [],
  type: 'offline',
  notes: 'Test appointment',
  consultationFee: 500
};

async function testAppointmentsAPI() {
  console.log('🧪 Testing Appointments API...\n');

  try {
    // Test 1: GET doctors list
    console.log('1. Testing GET /api/appointments/doctors');
    const doctorsResponse = await fetch(`${BASE_URL}/api/appointments/doctors`);
    const doctorsData = await doctorsResponse.json();
    
    if (doctorsResponse.ok) {
      console.log('✅ Doctors API working');
      console.log(`   Found ${doctorsData.data?.length || 0} doctors`);
    } else {
      console.log('❌ Doctors API failed:', doctorsData.message);
    }

    // Test 2: Test appointments endpoint (without auth - should fail)
    console.log('\n2. Testing GET /api/appointments (no auth)');
    const appointmentsResponse = await fetch(`${BASE_URL}/api/appointments`);
    const appointmentsData = await appointmentsResponse.json();
    
    if (appointmentsResponse.status === 401) {
      console.log('✅ Appointments API correctly requires authentication');
    } else {
      console.log('❌ Appointments API should require authentication');
    }

    // Test 3: Test appointment creation (without auth - should fail)
    console.log('\n3. Testing POST /api/appointments (no auth)');
    const createResponse = await fetch(`${BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAppointment)
    });
    
    if (createResponse.status === 401) {
      console.log('✅ Appointment creation correctly requires authentication');
    } else {
      console.log('❌ Appointment creation should require authentication');
    }

    // Test 4: Test payment order endpoint (without auth - should fail)
    console.log('\n4. Testing POST /api/payments/create-order (no auth)');
    const paymentResponse = await fetch(`${BASE_URL}/api/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 500,
        currency: 'INR',
        appointmentId: 'test-appointment-id'
      })
    });
    
    if (paymentResponse.status === 401) {
      console.log('✅ Payment order creation correctly requires authentication');
    } else {
      console.log('❌ Payment order creation should require authentication');
    }

    console.log('\n🎉 API tests completed!');
    console.log('\nℹ️  Note: To test authenticated endpoints, you would need to:');
    console.log('   1. Create a user account');
    console.log('   2. Log in to get a JWT token');
    console.log('   3. Include the token in the Authorization header');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAppointmentsAPI();
