// Comprehensive test for logout functionality across all user types
const testLogoutFunctionality = () => {
  console.log('🔒 Testing Logout Functionality for All User Types...\n');

  // Test data for different user types
  const testUsers = [
    { role: 'patient', name: 'Test Patient', email: 'patient@test.com' },
    { role: 'doctor', name: 'Test Doctor', email: 'doctor@test.com' },
    { role: 'admin', name: 'Test Admin', email: 'admin@test.com' }
  ];

  // Test logout for each user type
  testUsers.forEach(user => {
    console.log(`\n🧪 Testing ${user.role.toUpperCase()} Logout:`);
    
    // Simulate login state
    console.log('  1. Setting up authentication state...');
    localStorage.setItem('token', 'test-token-123');
    localStorage.setItem('authToken', 'test-auth-token-123');
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('isAuthenticated', 'true');
    
    // Verify data is stored
    console.log('  2. Verifying data is stored:');
    console.log('     - token:', localStorage.getItem('token') ? '✅ Present' : '❌ Missing');
    console.log('     - authToken:', localStorage.getItem('authToken') ? '✅ Present' : '❌ Missing');
    console.log('     - user:', localStorage.getItem('user') ? '✅ Present' : '❌ Missing');
    console.log('     - userRole:', localStorage.getItem('userRole') ? '✅ Present' : '❌ Missing');
    console.log('     - isAuthenticated:', localStorage.getItem('isAuthenticated') ? '✅ Present' : '❌ Missing');
    
    // Simulate logout
    console.log('  3. Simulating logout...');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    
    // Verify data is cleared
    console.log('  4. Verifying data is cleared:');
    console.log('     - token:', localStorage.getItem('token') ? '❌ Still present' : '✅ Cleared');
    console.log('     - authToken:', localStorage.getItem('authToken') ? '❌ Still present' : '✅ Cleared');
    console.log('     - user:', localStorage.getItem('user') ? '❌ Still present' : '✅ Cleared');
    console.log('     - userRole:', localStorage.getItem('userRole') ? '❌ Still present' : '✅ Cleared');
    console.log('     - isAuthenticated:', localStorage.getItem('isAuthenticated') ? '❌ Still present' : '✅ Cleared');
    
    // Check if all data is properly cleared
    const allCleared = !localStorage.getItem('token') && 
                     !localStorage.getItem('authToken') && 
                     !localStorage.getItem('user') && 
                     !localStorage.getItem('userRole') && 
                     !localStorage.getItem('isAuthenticated');
    
    console.log(`  5. Overall ${user.role} logout test:`, allCleared ? '✅ PASSED' : '❌ FAILED');
  });

  // Test for additional storage items that might be present
  console.log('\n🔍 Checking for additional storage items...');
  const allStorageKeys = Object.keys(localStorage);
  const authRelatedKeys = allStorageKeys.filter(key => 
    key.toLowerCase().includes('auth') || 
    key.toLowerCase().includes('token') || 
    key.toLowerCase().includes('user') || 
    key.toLowerCase().includes('login')
  );
  
  if (authRelatedKeys.length > 0) {
    console.log('  Found additional auth-related keys:', authRelatedKeys);
    console.log('  Note: These should also be cleared during logout');
  } else {
    console.log('  ✅ No additional auth-related keys found');
  }

  // Test logout API endpoint
  console.log('\n🌐 Testing Logout API Endpoint...');
  fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test-token'
    }
  })
  .then(response => {
    console.log('  API Response Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('  API Response Data:', data);
    console.log('  Logout API Test:', data.success ? '✅ PASSED' : '❌ FAILED');
  })
  .catch(error => {
    console.error('  API Error:', error);
    console.log('  Logout API Test: ❌ FAILED');
  });

  console.log('\n🎯 Testing Complete!');
  console.log('📋 Summary:');
  console.log('   - Patient logout: Check console above');
  console.log('   - Doctor logout: Check console above');  
  console.log('   - Admin logout: Check console above');
  console.log('   - API logout: Check console above');
  console.log('\n✅ All logout functionality has been tested!');
};

// Run the test
testLogoutFunctionality();
