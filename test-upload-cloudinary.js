// Test File Upload with Cloudinary Fix
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Test credentials
const testUsers = {
  doctor: {
    email: 'doctor@medimate.com',
    password: 'password123'
  },
  patient: {
    email: 'patient@medimate.com',
    password: 'password123'
  }
};

// Login function
async function login(email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email,
      password
    });
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test profile photo upload
async function testProfilePhotoUpload() {
  console.log('\n🖼️ TESTING PROFILE PHOTO UPLOAD WITH CLOUDINARY');
  console.log('=' .repeat(60));

  // Create a test image file
  const testImagePath = './test-upload-image.jpg';
  const testImageContent = Buffer.from('fake-image-data-for-testing', 'utf-8');
  
  for (const [userType, credentials] of Object.entries(testUsers)) {
    try {
      console.log(`\n📸 Testing ${userType} photo upload...`);
      
      // Login to get token
      const token = await login(credentials.email, credentials.password);
      if (!token) {
        console.log(`❌ ${userType} login failed`);
        continue;
      }

      // Create test image file
      fs.writeFileSync(testImagePath, testImageContent);

      // Create FormData
      const form = new FormData();
      form.append('profilePicture', fs.createReadStream(testImagePath));

      // Upload profile photo
      const response = await axios.post(`${BASE_URL}/api/users/upload-photo`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        console.log(`✅ ${userType} photo upload successful`);
        console.log(`   📍 URL: ${response.data.data.profilePicture}`);
        console.log(`   📊 Response: ${JSON.stringify(response.data, null, 2)}`);
      } else {
        console.log(`❌ ${userType} photo upload failed: ${response.data.message}`);
      }

      // Clean up test file
      try {
        fs.unlinkSync(testImagePath);
      } catch (error) {
        // File might not exist
      }

    } catch (error) {
      console.error(`❌ ${userType} photo upload error:`, error.response?.data || error.message);
    }
  }
}

// Test medical report upload
async function testMedicalReportUpload() {
  console.log('\n📋 TESTING MEDICAL REPORT UPLOAD WITH CLOUDINARY');
  console.log('=' .repeat(60));

  // Create a test PDF file
  const testPdfPath = './test-upload-report.pdf';
  const testPdfContent = Buffer.from('fake-pdf-data-for-testing', 'utf-8');

  try {
    console.log('\n📄 Testing patient report upload...');
    
    // Login as patient
    const token = await login(testUsers.patient.email, testUsers.patient.password);
    if (!token) {
      console.log('❌ Patient login failed');
      return;
    }

    // Create test PDF file
    fs.writeFileSync(testPdfPath, testPdfContent);

    // Create FormData
    const form = new FormData();
    form.append('file', fs.createReadStream(testPdfPath));
    form.append('type', 'blood-test');
    form.append('description', 'Test blood work report');
    form.append('reportDate', new Date().toISOString().split('T')[0]);
    form.append('doctor', 'Dr. Test');
    form.append('notes', 'Test notes for report');

    // Upload medical report
    const response = await axios.post(`${BASE_URL}/api/medical-records/upload`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.success) {
      console.log('✅ Medical report upload successful');
      console.log(`   📍 File URL: ${response.data.data.files[0].fileUrl}`);
      console.log(`   📊 Response: ${JSON.stringify(response.data, null, 2)}`);
    } else {
      console.log(`❌ Medical report upload failed: ${response.data.message}`);
    }

    // Clean up test file
    try {
      fs.unlinkSync(testPdfPath);
    } catch (error) {
      // File might not exist
    }

  } catch (error) {
    console.error('❌ Medical report upload error:', error.response?.data || error.message);
  }
}

// Main test function
async function runUploadTests() {
  console.log('🚀 MEDIMATE UPLOAD TESTS WITH CLOUDINARY');
  console.log('Testing upload functionality after filesystem fix');
  console.log('='.repeat(60));

  await testProfilePhotoUpload();
  await testMedicalReportUpload();

  console.log('\n✅ Upload tests completed!');
  console.log('📋 Summary: All uploads now use Cloudinary instead of local filesystem');
  console.log('🌍 This should resolve the EROFS read-only filesystem errors');
}

// Run the tests
runUploadTests().catch(console.error);
