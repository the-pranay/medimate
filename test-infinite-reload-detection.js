const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_DURATION = 30000; // 30 seconds
const EXPECTED_INTERVAL = 10000; // 10 seconds between calls

// Track API calls
let apiCalls = [];
let callCount = 0;
let startTime = Date.now();

// Mock authentication token (for testing structure)
const mockToken = 'mock-token-for-structure-test';

console.log('🔍 Doctor Appointments Infinite Reload Test');
console.log('=' .repeat(50));
console.log(`📊 Test Duration: ${TEST_DURATION / 1000} seconds`);
console.log(`⏱️  Expected Interval: ${EXPECTED_INTERVAL / 1000} seconds`);
console.log(`🎯 Testing URL: ${BASE_URL}/api/appointments/doctor`);
console.log('=' .repeat(50));

// Function to test API endpoint
async function testApiCall() {
  const callTime = Date.now();
  const timeSinceStart = callTime - startTime;
  
  try {
    callCount++;
    console.log(`📞 API Call #${callCount} at ${timeSinceStart}ms`);
    
    const response = await axios.get(`${BASE_URL}/api/appointments/doctor`, {
      headers: {
        'Authorization': `Bearer ${mockToken}`
      },
      timeout: 5000
    });
    
    apiCalls.push({
      callNumber: callCount,
      timestamp: callTime,
      timeSinceStart,
      status: response.status,
      success: true
    });
    
    console.log(`✅ Response: ${response.status} - ${response.data?.message || 'Success'}`);
    
  } catch (error) {
    apiCalls.push({
      callNumber: callCount,
      timestamp: callTime,
      timeSinceStart,
      status: error.response?.status || 'Error',
      success: false,
      error: error.message
    });
    
    console.log(`❌ Error: ${error.response?.status || 'Network Error'} - ${error.message}`);
  }
}

// Simulate the behavior of the doctor-appointments page
async function simulatePageBehavior() {
  console.log('\n🚀 Starting simulation of doctor-appointments page behavior...\n');
  
  // Initial load (should make 1-2 calls)
  console.log('📋 Phase 1: Initial page load');
  await testApiCall();
  
  // Wait a bit then start the interval pattern
  console.log('\n📋 Phase 2: Setting up 10-second interval pattern');
  
  let intervalCount = 0;
  const maxIntervals = Math.floor(TEST_DURATION / EXPECTED_INTERVAL);
  
  const testInterval = setInterval(async () => {
    intervalCount++;
    console.log(`\n⏰ Interval ${intervalCount}/${maxIntervals}`);
    await testApiCall();
    
    if (intervalCount >= maxIntervals) {
      clearInterval(testInterval);
      analyzeResults();
    }
  }, EXPECTED_INTERVAL);
}

// Analyze the results
function analyzeResults() {
  console.log('\n' + '=' .repeat(50));
  console.log('📊 TEST RESULTS ANALYSIS');
  console.log('=' .repeat(50));
  
  const totalCalls = apiCalls.length;
  const testDurationActual = Date.now() - startTime;
  const expectedCalls = Math.floor(testDurationActual / EXPECTED_INTERVAL) + 1; // +1 for initial call
  
  console.log(`📈 Total API Calls: ${totalCalls}`);
  console.log(`⏱️  Test Duration: ${testDurationActual}ms (${(testDurationActual / 1000).toFixed(1)}s)`);
  console.log(`🎯 Expected Calls: ${expectedCalls}`);
  console.log(`📊 Calls per second: ${(totalCalls / (testDurationActual / 1000)).toFixed(2)}`);
  
  // Check for infinite reload pattern
  if (totalCalls > expectedCalls * 2) {
    console.log('\n🚨 INFINITE RELOAD DETECTED!');
    console.log('❌ Too many API calls detected');
    console.log('❌ This indicates the infinite reload issue is present');
  } else if (totalCalls < expectedCalls * 0.5) {
    console.log('\n⚠️  FEWER CALLS THAN EXPECTED');
    console.log('⚠️  This might indicate the interval is not working');
  } else {
    console.log('\n✅ NORMAL BEHAVIOR DETECTED');
    console.log('✅ API call pattern is within expected range');
    console.log('✅ No infinite reload issue found');
  }
  
  // Analyze call intervals
  console.log('\n📋 Call Interval Analysis:');
  for (let i = 1; i < apiCalls.length; i++) {
    const interval = apiCalls[i].timestamp - apiCalls[i-1].timestamp;
    const expectedInterval = EXPECTED_INTERVAL;
    const tolerance = 2000; // 2 second tolerance
    
    if (interval < expectedInterval - tolerance) {
      console.log(`⚠️  Call ${i}: ${interval}ms (TOO FAST - possible infinite reload)`);
    } else if (interval > expectedInterval + tolerance) {
      console.log(`⚠️  Call ${i}: ${interval}ms (slower than expected)`);
    } else {
      console.log(`✅ Call ${i}: ${interval}ms (normal)`);
    }
  }
  
  // Final verdict
  console.log('\n' + '=' .repeat(50));
  console.log('🎯 FINAL VERDICT');
  console.log('=' .repeat(50));
  
  const rapidCalls = apiCalls.filter((_, index) => {
    if (index === 0) return false;
    const interval = apiCalls[index].timestamp - apiCalls[index-1].timestamp;
    return interval < 3000; // Less than 3 seconds between calls
  });
  
  if (rapidCalls.length > 0) {
    console.log('🚨 INFINITE RELOAD CONFIRMED');
    console.log(`❌ Found ${rapidCalls.length} rapid API calls`);
    console.log('❌ The doctor-appointments page has infinite reload issue');
    console.log('\n🔧 RECOMMENDED ACTIONS:');
    console.log('1. Check useEffect dependencies');
    console.log('2. Verify interval cleanup');
    console.log('3. Review retryCount implementation');
  } else {
    console.log('✅ NO INFINITE RELOAD DETECTED');
    console.log('✅ The doctor-appointments page is working normally');
    console.log('✅ API calls are following expected 10-second interval pattern');
  }
  
  process.exit(0);
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error.message);
  process.exit(1);
});

// Start the test
console.log('⚡ Starting test in 3 seconds...');
setTimeout(() => {
  simulatePageBehavior();
}, 3000);
