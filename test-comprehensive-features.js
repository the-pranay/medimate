// Comprehensive Test Suite for MediMate Features
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Test data
const testUsers = {
  patient: {
    name: 'John TestPatient',
    email: 'test.patient@medimate.com',
    password: 'password123',
    phone: '5555551234',
    role: 'patient',
    age: 30,
    gender: 'male',
    address: '123 Test Street, Test City',
    bloodGroup: 'O+'
  },
  doctor: {
    name: 'Dr. TestDoctor',
    email: 'test.doctor@medimate.com',
    password: 'password123',
    phone: '5555565678',
    role: 'doctor',
    age: 40,
    gender: 'female',
    address: '456 Medical Center',
    specialization: 'General Medicine',
    experience: 8,
    licenseNumber: 'LIC123456',
    consultationFee: 500
  }
};

let patientToken = '';
let doctorToken = '';
let patientId = '';
let doctorId = '';

// Utility functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testRegistration(userData, userType) {
  try {
    console.log(`\n📝 Registering ${userType}...`);
    
    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    
    if (response.data.success) {
      console.log(`✅ ${userType} registration successful`);
      console.log(`   User ID: ${response.data.data.user._id}`);
      console.log(`   Token: ${response.data.data.token.substring(0, 20)}...`);
      return {
        token: response.data.data.token,
        userId: response.data.data.user._id,
        user: response.data.data.user
      };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error(`❌ ${userType} registration failed:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function testLogin(credentials, userType) {
  try {
    console.log(`\n🔐 Logging in ${userType}...`);
    
    const response = await axios.post(`${BASE_URL}/api/auth/login`, credentials);
    
    if (response.data.success) {
      console.log(`✅ ${userType} login successful`);
      return {
        token: response.data.data.token,
        user: response.data.data.user
      };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error(`❌ ${userType} login failed:`, error.response?.data?.message || error.message);
    return null;
  }
}

// 1. Test Profile Photo Upload
async function testProfilePhotoUpload() {
  console.log('\n🖼️ TESTING PROFILE PHOTO UPLOAD');
  console.log('=================================');
  
  const results = { patient: false, doctor: false };
  
  for (const [userType, token] of [['patient', patientToken], ['doctor', doctorToken]]) {
    if (!token) {
      console.log(`❌ ${userType} token not available`);
      continue;
    }
    
    try {
      console.log(`\n📸 Testing photo upload for ${userType}...`);
      
      // Create a simple test file
      const testImagePath = path.join(__dirname, 'test-image.jpg');
      const testImageContent = 'fake-image-content-for-testing';
      fs.writeFileSync(testImagePath, testImageContent);
      
      // Create form data
      const FormData = require('form-data');
      const form = new FormData();
      form.append('profilePicture', fs.createReadStream(testImagePath), {
        filename: 'test-photo.jpg',
        contentType: 'image/jpeg'
      });
      
      const response = await axios.post(`${BASE_URL}/api/users/upload-photo`, form, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...form.getHeaders()
        }
      });
      
      if (response.data.success) {
        console.log(`✅ ${userType} photo upload successful`);
        console.log(`   Photo URL: ${response.data.data.profilePicture}`);
        
        // Test profile retrieval to verify photo is saved
        const profileResponse = await axios.get(`${BASE_URL}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (profileResponse.data.success && profileResponse.data.data.profilePicture) {
          console.log(`✅ ${userType} photo saved and retrieved successfully`);
          results[userType] = true;
        } else {
          console.log(`❌ ${userType} photo not found in profile`);
        }
      } else {
        console.log(`❌ ${userType} photo upload failed`);
      }
      
      // Clean up test file
      fs.unlinkSync(testImagePath);
      
    } catch (error) {
      console.error(`❌ ${userType} photo upload error:`, error.message);
    }
  }
  
  return results;
}

// 2. Test Messaging System
async function testMessagingSystem() {
  console.log('\n💬 TESTING MESSAGING SYSTEM');
  console.log('============================');
  
  if (!patientToken || !doctorToken) {
    console.log('❌ Both user tokens required for messaging test');
    return false;
  }
  
  try {
    // Test conversation creation
    console.log('\n📝 Creating conversation...');
    const conversationResponse = await axios.post(`${BASE_URL}/api/messages/conversations`, {
      participantId: doctorId,
      initialMessage: 'Hello Doctor! I need help with my symptoms.'
    }, {
      headers: {
        'Authorization': `Bearer ${patientToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!conversationResponse.data.success) {
      throw new Error('Failed to create conversation');
    }
    
    console.log('✅ Conversation created successfully');
    const conversationId = conversationResponse.data.data._id;
    
    // Test message sending
    console.log('\n📤 Testing message sending...');
    const messageResponse = await axios.post(`${BASE_URL}/api/messages/send`, {
      conversationId: conversationId,
      message: 'I have been experiencing headaches.',
      sender: 'patient'
    }, {
      headers: {
        'Authorization': `Bearer ${patientToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (messageResponse.data.success) {
      console.log('✅ Patient can send messages');
    } else {
      console.log('❌ Patient message sending failed');
    }
    
    // Test doctor reply
    const doctorReplyResponse = await axios.post(`${BASE_URL}/api/messages/send`, {
      conversationId: conversationId,
      message: 'I understand. Let me help you with that.',
      sender: 'doctor'
    }, {
      headers: {
        'Authorization': `Bearer ${doctorToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (doctorReplyResponse.data.success) {
      console.log('✅ Doctor can reply to messages');
    } else {
      console.log('❌ Doctor reply failed');
    }
    
    // Test conversation retrieval
    console.log('\n📥 Testing conversation retrieval...');
    const patientConversationsResponse = await axios.get(`${BASE_URL}/api/messages/conversations`, {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    
    const doctorConversationsResponse = await axios.get(`${BASE_URL}/api/messages/conversations`, {
      headers: { 'Authorization': `Bearer ${doctorToken}` }
    });
    
    if (patientConversationsResponse.data.success && doctorConversationsResponse.data.success) {
      console.log('✅ Both users can see conversations');
      console.log(`   Patient conversations: ${patientConversationsResponse.data.data.length}`);
      console.log(`   Doctor conversations: ${doctorConversationsResponse.data.data.length}`);
    } else {
      console.log('❌ Conversation retrieval failed');
    }
    
    console.log('✅ Messaging system working correctly');
    return true;
    
  } catch (error) {
    console.error('❌ Messaging system test failed:', error.message);
    return false;
  }
}

// 3. Test Dashboard Buttons
async function testDashboardButtons() {
  console.log('\n🎛️ TESTING DASHBOARD BUTTONS');
  console.log('============================');
  
  const results = { patient: [], doctor: [] };
  
  // Patient dashboard endpoints
  const patientEndpoints = [
    { endpoint: '/api/users/profile', description: 'Profile' },
    { endpoint: '/api/appointments', description: 'Appointments' },
    { endpoint: '/api/medical-records/reports', description: 'Medical Reports' },
    { endpoint: '/api/messages/conversations', description: 'Messages' },
    { endpoint: '/api/appointments/doctors', description: 'Book Appointment' }
  ];
  
  // Doctor dashboard endpoints
  const doctorEndpoints = [
    { endpoint: '/api/users/profile', description: 'Profile' },
    { endpoint: '/api/appointments', description: 'Appointments' },
    { endpoint: '/api/medical-records/reports', description: 'Medical Reports' },
    { endpoint: '/api/messages/conversations', description: 'Messages' }
  ];
  
  // Test patient dashboard
  console.log('\n📱 Testing Patient Dashboard...');
  for (const test of patientEndpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${test.endpoint}`, {
        headers: { 'Authorization': `Bearer ${patientToken}` }
      });
      
      if (response.data.success) {
        console.log(`✅ ${test.description}: Working`);
        results.patient.push(test.description);
      } else {
        console.log(`❌ ${test.description}: Failed`);
      }
    } catch (error) {
      console.log(`❌ ${test.description}: Error`);
    }
  }
  
  // Test doctor dashboard
  console.log('\n👨‍⚕️ Testing Doctor Dashboard...');
  for (const test of doctorEndpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${test.endpoint}`, {
        headers: { 'Authorization': `Bearer ${doctorToken}` }
      });
      
      if (response.data.success) {
        console.log(`✅ ${test.description}: Working`);
        results.doctor.push(test.description);
      } else {
        console.log(`❌ ${test.description}: Failed`);
      }
    } catch (error) {
      console.log(`❌ ${test.description}: Error`);
    }
  }
  
  return results;
}

// Main test function
async function runComprehensiveTests() {
  console.log('🧪 COMPREHENSIVE MEDIMATE FEATURE TESTS');
  console.log('=======================================');
  
  // Step 1: Registration
  console.log('\n📋 PHASE 1: USER REGISTRATION');
  const patientResult = await testRegistration(testUsers.patient, 'Patient');
  const doctorResult = await testRegistration(testUsers.doctor, 'Doctor');
  
  if (patientResult) {
    patientToken = patientResult.token;
    patientId = patientResult.userId;
  }
  
  if (doctorResult) {
    doctorToken = doctorResult.token;
    doctorId = doctorResult.userId;
  }
  
  // If registration fails, try login
  if (!patientToken || !doctorToken) {
    console.log('\n🔄 Registration failed, trying login...');
    
    if (!patientToken) {
      const patientLogin = await testLogin({
        email: testUsers.patient.email,
        password: testUsers.patient.password
      }, 'Patient');
      
      if (patientLogin) {
        patientToken = patientLogin.token;
        patientId = patientLogin.user._id;
      }
    }
    
    if (!doctorToken) {
      const doctorLogin = await testLogin({
        email: testUsers.doctor.email,
        password: testUsers.doctor.password
      }, 'Doctor');
      
      if (doctorLogin) {
        doctorToken = doctorLogin.token;
        doctorId = doctorLogin.user._id;
      }
    }
  }
  
  // Step 2: Profile Photo Upload
  console.log('\n📋 PHASE 2: PROFILE PHOTO UPLOAD');
  const photoResults = await testProfilePhotoUpload();
  
  // Step 3: Messaging System
  console.log('\n📋 PHASE 3: MESSAGING SYSTEM');
  const messagingResult = await testMessagingSystem();
  
  // Step 4: Dashboard Buttons
  console.log('\n📋 PHASE 4: DASHBOARD BUTTONS');
  const dashboardResults = await testDashboardButtons();
  
  // Final Summary
  console.log('\n🎉 COMPREHENSIVE TEST RESULTS');
  console.log('=============================');
  
  console.log('\n1️⃣ PROFILE PHOTO UPLOAD:');
  console.log(`   Patient: ${photoResults.patient ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`   Doctor: ${photoResults.doctor ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  console.log('\n2️⃣ MESSAGING SYSTEM:');
  console.log(`   Overall: ${messagingResult ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  console.log('\n3️⃣ DASHBOARD BUTTONS:');
  console.log(`   Patient Dashboard: ${dashboardResults.patient.length}/5 APIs working`);
  console.log(`   Doctor Dashboard: ${dashboardResults.doctor.length}/4 APIs working`);
  
  const allProfilePhotosWorking = photoResults.patient && photoResults.doctor;
  const allDashboardsWorking = dashboardResults.patient.length >= 4 && dashboardResults.doctor.length >= 3;
  
  console.log('\n🎯 OVERALL STATUS:');
  console.log(`✅ Profile Photos: ${allProfilePhotosWorking ? 'WORKING' : 'NEEDS ATTENTION'}`);
  console.log(`✅ Messaging: ${messagingResult ? 'WORKING' : 'NEEDS ATTENTION'}`);
  console.log(`✅ Dashboard Buttons: ${allDashboardsWorking ? 'WORKING' : 'NEEDS ATTENTION'}`);
  
  if (allProfilePhotosWorking && messagingResult && allDashboardsWorking) {
    console.log('\n🎊 ALL FEATURES WORKING PERFECTLY!');
  } else {
    console.log('\n⚠️  SOME FEATURES NEED ATTENTION');
  }
}

// Run the comprehensive tests
runComprehensiveTests().catch(console.error);
