// Test script to verify photo upload functionality
import fetch from 'node-fetch';
import fs from 'fs';
import { FormData } from 'formdata-node';
import { fileFromSync } from 'fetch-blob/from.js';

const API_BASE = 'http://localhost:3001/api';

async function testPhotoUpload() {
  console.log('Testing Profile Photo Upload...\n');
  
  try {
    // Step 1: Login as patient
    console.log('1. Logging in as patient...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testpatient@example.com',
        password: 'password123'
      })
    });
    
    const loginResult = await loginResponse.json();
    if (!loginResult.success) {
      console.log('Login failed:', loginResult.message);
      return;
    }
    
    const token = loginResult.data.token;
    console.log('Login successful, token obtained');
    
    // Step 2: Create a test image file
    console.log('2. Creating test image file...');
    const testImagePath = './test-image.jpg';
    
    // Create a simple test image data (1x1 pixel JPEG)
    const testImageData = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
      0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
      0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
      0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20, 0x24, 0x2E, 0x27, 0x20,
      0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29, 0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27,
      0x39, 0x3D, 0x38, 0x32, 0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xD9
    ]);
    
    fs.writeFileSync(testImagePath, testImageData);
    console.log('Test image created');
    
    // Step 3: Upload the image
    console.log('3. Uploading profile photo...');
    const formData = new FormData();
    const file = fileFromSync(testImagePath, 'image/jpeg');
    formData.append('profilePicture', file, 'test-image.jpg');
    
    const uploadResponse = await fetch(`${API_BASE}/users/upload-photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const uploadResult = await uploadResponse.json();
    console.log('Upload response:', uploadResult);
    
    if (uploadResult.success) {
      console.log('✅ Photo upload successful!');
      console.log('Profile picture URL:', uploadResult.data.profilePicture);
    } else {
      console.log('❌ Photo upload failed:', uploadResult.message);
    }
    
    // Clean up test file
    fs.unlinkSync(testImagePath);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testPhotoUpload();
