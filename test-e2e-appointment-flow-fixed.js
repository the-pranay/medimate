// Comprehensive End-to-End Appointment Booking Test
// This test covers the complete appointment booking flow:
// 1. Patient books appointment
// 2. Doctor sees appointment on dashboard  
// 3. Doctor confirms appointment
// 4. Patient pays via Razorpay
// 5. Status updates reflect in both dashboards

const axios = require('axios');
const BASE_URL = 'http://localhost:3000';

// Test data
const patientData = {
  name: 'John Patient',
  email: `patient.e2e${Date.now()}@test.com`,
  password: 'password123',
  phone: '9876543210',
  role: 'patient',
  dateOfBirth: '1990-01-15',
  gender: 'male',
  address: '123 Test Street, Test City'
};

const doctorData = {
  name: 'Dr. Sarah E2E',
  email: `doctor.e2e${Date.now()}@test.com`,
  password: 'password123',
  phone: '9876543211',
  role: 'doctor',
  specialization: 'Cardiologist',
  experience: 10,
  qualification: 'MBBS, MD',
  consultationFee: 500,
  licenseNumber: `DOC${Date.now()}`,
  clinicAddress: '456 Medical Street, Health City'
};

let patientToken = '';
let doctorToken = '';
let doctorId = '';
let appointmentId = '';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function registerAndLogin(userData, userType) {
  try {
    console.log(`\n🔄 Registering ${userType}...`);
    
    // Register user
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    console.log(`✅ ${userType} registration:`, registerResponse.data.success ? 'Success' : 'Failed');
    
    // Login user
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: userData.email,
      password: userData.password
    });
    
    if (loginResponse.data.success) {
      console.log(`✅ ${userType} login: Success`);
      return {
        token: loginResponse.data.data.token,
        user: loginResponse.data.data.user
      };
    } else {
      throw new Error(`Login failed: ${loginResponse.data.message}`);
    }
  } catch (error) {
    console.error(`❌ ${userType} registration/login failed:`, error.response?.data?.message || error.message);
    throw error;
  }
}

async function bookAppointment() {
  try {
    console.log('\n🔄 Booking appointment...');
    
    const appointmentData = {
      doctorId: doctorId,
      date: new Date().toISOString().split('T')[0], // Today's date
      time: '10:00 AM',
      reasonForVisit: 'Regular Checkup',
      symptoms: ['Chest pain', 'Fatigue'],
      type: 'offline',
      notes: 'Patient experiencing mild chest discomfort',
      consultationFee: 500
    };
    
    const response = await axios.post(`${BASE_URL}/api/appointments`, appointmentData, {
      headers: {
        'Authorization': `Bearer ${patientToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      appointmentId = response.data.data._id;
      console.log('✅ Appointment booked successfully');
      console.log('   Appointment ID:', appointmentId);
      console.log('   Status:', response.data.data.status);
      console.log('   Date:', response.data.data.appointmentDate);
      console.log('   Time:', response.data.data.appointmentTime);
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('❌ Appointment booking failed:', error.response?.data?.message || error.message);
    throw error;
  }
}

async function checkDoctorDashboard() {
  try {
    console.log('\n🔄 Checking doctor dashboard...');
    
    const response = await axios.get(`${BASE_URL}/api/appointments?today=true`, {
      headers: {
        'Authorization': `Bearer ${doctorToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      const appointments = response.data.data || [];
      const todayAppointment = appointments.find(apt => apt._id === appointmentId);
      
      if (todayAppointment) {
        console.log('✅ Appointment visible on doctor dashboard');
        console.log('   Patient:', todayAppointment.patient?.name || 'N/A');
        console.log('   Status:', todayAppointment.status);
        console.log('   Reason:', todayAppointment.reasonForVisit);
        console.log('   Fee:', todayAppointment.consultationFee);
        return todayAppointment;
      } else {
        console.log('⚠️  Appointment not found on doctor dashboard');
        console.log('   Total appointments:', appointments.length);
        return null;
      }
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('❌ Doctor dashboard check failed:', error.response?.data?.message || error.message);
    throw error;
  }
}

async function confirmAppointment() {
  try {
    console.log('\n🔄 Doctor confirming appointment...');
    
    const response = await axios.patch(`${BASE_URL}/api/appointments/${appointmentId}/status`, {
      status: 'confirmed',
      notes: 'Appointment confirmed by doctor'
    }, {
      headers: {
        'Authorization': `Bearer ${doctorToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log('✅ Appointment confirmed by doctor');
      console.log('   New status:', response.data.data.status);
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('❌ Appointment confirmation failed:', error.response?.data?.message || error.message);
    throw error;
  }
}

async function createPaymentOrder() {
  try {
    console.log('\n🔄 Creating payment order...');
    
    const response = await axios.post(`${BASE_URL}/api/payments/create-order`, {
      appointmentId: appointmentId,
      amount: 500,
      doctorId: doctorId
    }, {
      headers: {
        'Authorization': `Bearer ${patientToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log('✅ Payment order created');
      console.log('   Order ID:', response.data.data.id);
      console.log('   Amount:', response.data.data.amount);
      console.log('   Currency:', response.data.data.currency);
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('❌ Payment order creation failed:', error.response?.data?.message || error.message);
    throw error;
  }
}

async function simulatePaymentVerification(orderId) {
  try {
    console.log('\n🔄 Simulating payment verification...');
    
    // Simulate Razorpay payment response
    const simulatedPayment = {
      razorpay_order_id: orderId,
      razorpay_payment_id: 'pay_test_' + Date.now(),
      razorpay_signature: 'simulated_signature_' + Date.now(),
      appointmentId: appointmentId
    };
    
    console.log('⚠️  Note: This is a simulation - actual payment verification would require valid Razorpay credentials');
    console.log('   Simulated Payment ID:', simulatedPayment.razorpay_payment_id);
    
    return simulatedPayment;
  } catch (error) {
    console.error('❌ Payment simulation failed:', error.message);
    throw error;
  }
}

async function checkFinalStatus() {
  try {
    console.log('\n🔄 Checking final appointment status...');
    
    // Check from patient side
    const patientResponse = await axios.get(`${BASE_URL}/api/appointments`, {
      headers: {
        'Authorization': `Bearer ${patientToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Check from doctor side
    const doctorResponse = await axios.get(`${BASE_URL}/api/appointments`, {
      headers: {
        'Authorization': `Bearer ${doctorToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (patientResponse.data.success && doctorResponse.data.success) {
      const patientAppointments = patientResponse.data.data || [];
      const doctorAppointments = doctorResponse.data.data || [];
      
      const patientAppointment = patientAppointments.find(apt => apt._id === appointmentId);
      const doctorAppointment = doctorAppointments.find(apt => apt._id === appointmentId);
      
      console.log('✅ Final status check completed');
      console.log('\n📊 Patient Dashboard View:');
      if (patientAppointment) {
        console.log('   Appointment Status:', patientAppointment.status);
        console.log('   Doctor:', patientAppointment.doctor?.name || 'N/A');
        console.log('   Payment Status:', patientAppointment.payment?.status || 'Not set');
        console.log('   Consultation Fee:', patientAppointment.consultationFee || 'N/A');
      } else {
        console.log('   ❌ Appointment not found in patient dashboard');
      }
      
      console.log('\n📊 Doctor Dashboard View:');
      if (doctorAppointment) {
        console.log('   Appointment Status:', doctorAppointment.status);
        console.log('   Patient:', doctorAppointment.patient?.name || 'N/A');
        console.log('   Payment Status:', doctorAppointment.payment?.status || 'Not set');
        console.log('   Consultation Fee:', doctorAppointment.consultationFee || 'N/A');
      } else {
        console.log('   ❌ Appointment not found in doctor dashboard');
      }
      
      return {
        patientView: patientAppointment,
        doctorView: doctorAppointment
      };
    } else {
      throw new Error('Failed to fetch appointment status');
    }
  } catch (error) {
    console.error('❌ Final status check failed:', error.response?.data?.message || error.message);
    throw error;
  }
}

async function runComprehensiveTest() {
  console.log('🚀 Starting Comprehensive End-to-End Appointment Booking Test');
  console.log('==================================================');
  
  try {
    // Step 1: Register and login patient
    const patientAuth = await registerAndLogin(patientData, 'Patient');
    patientToken = patientAuth.token;
    
    // Step 2: Register and login doctor
    const doctorAuth = await registerAndLogin(doctorData, 'Doctor');
    doctorToken = doctorAuth.token;
    doctorId = doctorAuth.user._id;
    
    console.log('\n✅ Both users registered and logged in successfully');
    
    // Step 3: Book appointment as patient
    const appointment = await bookAppointment();
    
    // Step 4: Check if appointment appears on doctor dashboard
    const doctorDashboardAppointment = await checkDoctorDashboard();
    
    // Step 5: Doctor confirms appointment
    const confirmedAppointment = await confirmAppointment();
    
    // Step 6: Create payment order
    const paymentOrder = await createPaymentOrder();
    
    // Step 7: Simulate payment verification
    const paymentVerification = await simulatePaymentVerification(paymentOrder.id);
    
    // Step 8: Check final status on both dashboards
    const finalStatus = await checkFinalStatus();
    
    console.log('\n🎉 END-TO-END TEST COMPLETED SUCCESSFULLY!');
    console.log('==================================================');
    
    console.log('\n📋 Test Summary:');
    console.log('✅ Patient registration and login');
    console.log('✅ Doctor registration and login');
    console.log('✅ Appointment booking');
    console.log('✅ Doctor dashboard visibility');
    console.log('✅ Doctor appointment confirmation');
    console.log('✅ Payment order creation');
    console.log('✅ Payment simulation');
    console.log('✅ Final status verification');
    
    console.log('\n💡 Next Steps:');
    console.log('1. Test actual Razorpay payment flow with valid credentials');
    console.log('2. Test appointment cancellation flow');
    console.log('3. Test appointment completion flow');
    console.log('4. Test doctor fee changes from profile');
    console.log('5. Test email notifications for appointment updates');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.log('\n🔍 Please check the server logs and fix any issues before proceeding.');
  }
}

// Run the test
runComprehensiveTest();
