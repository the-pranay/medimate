// Test script to verify payment flow
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const API_BASE = 'http://localhost:3001/api';

async function testPaymentFlow() {
  console.log('Testing Razorpay Payment Flow...\n');
  
  try {
    // Step 1: Register/Login a patient
    console.log('1. Registering a test patient...');
    const patientData = {
      name: 'Test Patient',
      email: 'testpatient@example.com',
      password: 'password123',
      phone: '9876543210',
      role: 'patient'
    };
    
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });
    
    const registerResult = await registerResponse.json();
    console.log('Registration result:', registerResult.success ? 'Success' : 'Failed');
    
    if (!registerResult.success) {
      // Try to login instead
      console.log('Registration failed, trying to login...');
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: patientData.email,
          password: patientData.password
        })
      });
      
      const loginResult = await loginResponse.json();
      if (loginResult.success) {
        console.log('Login successful');
        var token = loginResult.data.token;
      } else {
        console.log('Login failed:', loginResult.message);
        return;
      }
    } else {
      var token = registerResult.data.token;
    }
    
    console.log('Patient token obtained:', token ? 'Yes' : 'No');
    
    // Step 2: Get available doctors
    console.log('\n2. Fetching available doctors...');
    const doctorsResponse = await fetch(`${API_BASE}/appointments/doctors`);
    const doctorsResult = await doctorsResponse.json();
    
    if (!doctorsResult.success || !doctorsResult.data || doctorsResult.data.length === 0) {
      console.log('No doctors available for testing');
      return;
    }
    
    const testDoctor = doctorsResult.data[0];
    console.log(`Found doctor: ${testDoctor.name} (Fee: ₹${testDoctor.consultationFee})`);
    
    // Step 3: Create appointment
    console.log('\n3. Creating appointment...');
    const appointmentData = {
      doctorId: testDoctor._id,
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      reasonForVisit: 'Regular Checkup',
      symptoms: [],
      type: 'offline',
      notes: 'Test appointment for payment verification',
      consultationFee: testDoctor.consultationFee
    };
    
    const appointmentResponse = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    });
    
    const appointmentResult = await appointmentResponse.json();
    console.log('Appointment creation:', appointmentResult.success ? 'Success' : 'Failed');
    
    if (!appointmentResult.success) {
      console.log('Error:', appointmentResult.message);
      return;
    }
    
    const appointmentId = appointmentResult.data._id;
    console.log('Appointment ID:', appointmentId);
    
    // Step 4: Create payment order
    console.log('\n4. Creating payment order...');
    const paymentOrderData = {
      appointmentId: appointmentId,
      amount: testDoctor.consultationFee,
      doctorId: testDoctor._id
    };
    
    const paymentOrderResponse = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentOrderData)
    });
    
    const paymentOrderResult = await paymentOrderResponse.json();
    console.log('Payment order creation:', paymentOrderResult.success ? 'Success' : 'Failed');
    
    if (!paymentOrderResult.success) {
      console.log('Error:', paymentOrderResult.message);
      return;
    }
    
    console.log('Payment order details:');
    console.log('- Order ID:', paymentOrderResult.data.id);
    console.log('- Amount:', paymentOrderResult.data.amount);
    console.log('- Currency:', paymentOrderResult.data.currency);
    console.log('- Razorpay Key:', paymentOrderResult.data.razorpayKey ? 'Present' : 'Missing');
    
    // Step 5: Verify environment variables
    console.log('\n5. Verifying environment variables...');
    console.log('- RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing');
    console.log('- RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing');
    
    console.log('\n✅ Payment flow test completed successfully!');
    console.log('The "No key passed" error should now be resolved.');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testPaymentFlow();
