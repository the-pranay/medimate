// Test script to verify doctor appointments API is working
const testDoctorAppointments = async () => {
  try {
    console.log('Testing doctor appointments API...');
    
    // Test without authentication (should get 401)
    const response = await fetch('http://localhost:3000/api/appointments/doctor');
    console.log('No auth response status:', response.status);
    
    if (response.status === 401) {
      console.log('✅ API is working - properly returns 401 for unauthenticated requests');
    } else {
      console.log('❌ Unexpected response status:', response.status);
    }
    
    // Test with the API structure
    const responseData = await response.json();
    console.log('Response data:', responseData);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testDoctorAppointments();
