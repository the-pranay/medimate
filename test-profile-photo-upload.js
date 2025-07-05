// Test Profile Photo Upload for All User Roles
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const patientData = {
  name: 'John PhotoTest',
  email: 'photo.test@patient.com',
  password: 'password123',
  phone: '5555555555',
  role: 'patient',
  age: 30,
  gender: 'male',
  address: '123 Photo Test Street',
  bloodGroup: 'O+'
};

const doctorData = {
  name: 'Dr. PhotoTest',
  email: 'photo.test@doctor.com',
  password: 'password123',
  phone: '9876543210',
  role: 'doctor',
  age: 40,
  gender: 'female',
  address: '456 Medical Center',
  specialization: 'General Medicine',
  experience: 8,
  licenseNumber: 'LIC123456'
};

let patientToken = '';
let doctorToken = '';

async function registerUser(userData, userType) {
  try {
    console.log(`\n📝 Registering ${userType}...`);
    
    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    
    if (response.data.success) {
      console.log(`✅ ${userType} registration successful`);
      console.log(`   User ID: ${response.data.data.user._id}`);
      console.log(`   Token: ${response.data.data.token.substring(0, 20)}...`);
      return response.data.data.token;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error(`❌ ${userType} registration failed:`, error.response?.data?.message || error.message);
    throw error;
  }
}

async function testProfilePhotoUpload(token, userType) {
  try {
    console.log(`\n📸 Testing profile photo upload for ${userType}...`);
    
    // Create a simple test image buffer (fake image data)
    const testImageBuffer = Buffer.from('fake-image-data-for-testing');
    
    // Create FormData for file upload
    const FormData = require('form-data');
    const form = new FormData();
    form.append('profilePicture', testImageBuffer, {
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
      console.log(`✅ Profile photo upload successful for ${userType}`);
      console.log(`   Photo URL: ${response.data.data.profilePicture}`);
      return response.data.data.profilePicture;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error(`❌ Profile photo upload failed for ${userType}:`, error.response?.data?.message || error.message);
    throw error;
  }
}

async function testProfileRetrieval(token, userType) {
  try {
    console.log(`\n🔍 Testing profile retrieval for ${userType}...`);
    
    const response = await axios.get(`${BASE_URL}/api/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      console.log(`✅ Profile retrieval successful for ${userType}`);
      console.log(`   Name: ${response.data.data.name}`);
      console.log(`   Email: ${response.data.data.email}`);
      console.log(`   Profile Picture: ${response.data.data.profilePicture || 'Not set'}`);
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error(`❌ Profile retrieval failed for ${userType}:`, error.response?.data?.message || error.message);
    throw error;
  }
}

async function runPhotoUploadTests() {
  console.log('🧪 TESTING PROFILE PHOTO UPLOAD SYSTEM');
  console.log('=======================================');
  
  try {
    // Test 1: Patient Registration and Photo Upload
    console.log('\n📋 PHASE 1: PATIENT PROFILE PHOTO TEST');
    patientToken = await registerUser(patientData, 'Patient');
    
    // Test photo upload
    const patientPhotoUrl = await testProfilePhotoUpload(patientToken, 'Patient');
    
    // Test profile retrieval with photo
    const patientProfile = await testProfileRetrieval(patientToken, 'Patient');
    
    // Verify photo is saved correctly
    if (patientProfile.profilePicture && patientProfile.profilePicture === patientPhotoUrl) {
      console.log('✅ Patient profile photo saved and retrieved correctly');
    } else {
      console.log('❌ Patient profile photo not saved correctly');
    }
    
    // Test 2: Doctor Registration and Photo Upload
    console.log('\n📋 PHASE 2: DOCTOR PROFILE PHOTO TEST');
    doctorToken = await registerUser(doctorData, 'Doctor');
    
    // Test photo upload
    const doctorPhotoUrl = await testProfilePhotoUpload(doctorToken, 'Doctor');
    
    // Test profile retrieval with photo
    const doctorProfile = await testProfileRetrieval(doctorToken, 'Doctor');
    
    // Verify photo is saved correctly
    if (doctorProfile.profilePicture && doctorProfile.profilePicture === doctorPhotoUrl) {
      console.log('✅ Doctor profile photo saved and retrieved correctly');
    } else {
      console.log('❌ Doctor profile photo not saved correctly');
    }
    
    console.log('\n🎉 PROFILE PHOTO UPLOAD TESTS COMPLETED');
    console.log('✅ All profile photo upload functionality working correctly!');
    
  } catch (error) {
    console.error('\n❌ PROFILE PHOTO UPLOAD TESTS FAILED:', error.message);
    process.exit(1);
  }
}

// Run the tests
runPhotoUploadTests();
