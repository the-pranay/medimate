// Test script to check Vercel deployment
import axios from 'axios';

const BASE_URL = 'https://new-medimate.vercel.app';

async function testVercelDeployment() {
  console.log('🔍 Testing Vercel deployment...');
  
  try {
    // Test 1: Check if the main page loads
    console.log('\n1. Testing main page...');
    const homeResponse = await axios.get(BASE_URL);
    console.log('✅ Main page status:', homeResponse.status);
    
    // Test 2: Test login API
    console.log('\n2. Testing login API...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'patient@demo.com',
      password: 'demo123'
    });
    console.log('✅ Login API status:', loginResponse.status);
    console.log('Login response:', loginResponse.data);
    
    // Test 3: Test registration API
    console.log('\n3. Testing registration API...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '+91 9876543210',
      role: 'patient',
      age: 25,
      gender: 'male'
    });
    console.log('✅ Registration API status:', registerResponse.status);
    console.log('Registration response:', registerResponse.data);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testVercelDeployment();
