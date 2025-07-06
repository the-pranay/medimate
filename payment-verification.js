/**
 * Payment Success Verification Script
 * This script helps verify if payments are successful in the MediMate app
 */

const crypto = require('crypto');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  testUser: {
    email: 'test@example.com',
    password: 'test123',
    name: 'Test User'
  },
  testCard: {
    number: '4111111111111111',
    expiry: '12/25',
    cvv: '123',
    name: 'Test User'
  }
};

// Mock Razorpay response for testing
const generateMockRazorpayResponse = (orderId) => {
  const paymentId = `pay_${Math.random().toString(36).substr(2, 9)}`;
  
  // Create mock signature for testing
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'test_secret';
  const body = orderId + "|" + paymentId;
  const signature = crypto
    .createHmac('sha256', keySecret)
    .update(body.toString())
    .digest('hex');
  
  return {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature
  };
};

// API helper functions
const apiRequest = async (endpoint, options = {}) => {
  const url = `${TEST_CONFIG.baseUrl}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`API Error: ${data.message || response.statusText}`);
  }
  
  return data;
};

// Test functions
const testLogin = async () => {
  console.log('🔑 Testing login...');
  
  try {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: TEST_CONFIG.testUser.email,
        password: TEST_CONFIG.testUser.password
      })
    });
    
    console.log('✅ Login successful');
    return response.data.token;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    throw error;
  }
};

const testCreateOrder = async (token, appointmentId) => {
  console.log('💳 Testing payment order creation...');
  
  try {
    const response = await apiRequest('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        appointmentId: appointmentId,
        amount: 500
      })
    });
    
    console.log('✅ Payment order created:', response.data.orderId);
    return response.data;
  } catch (error) {
    console.error('❌ Order creation failed:', error.message);
    throw error;
  }
};

const testPaymentVerification = async (token, appointmentId, orderData) => {
  console.log('🔍 Testing payment verification...');
  
  try {
    // Generate mock Razorpay response
    const mockPaymentResponse = generateMockRazorpayResponse(orderData.orderId);
    
    console.log('Mock payment response:', mockPaymentResponse);
    
    const response = await apiRequest('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...mockPaymentResponse,
        appointmentId: appointmentId
      })
    });
    
    console.log('✅ Payment verification successful');
    return response.data;
  } catch (error) {
    console.error('❌ Payment verification failed:', error.message);
    throw error;
  }
};

const testAppointmentStatus = async (token, appointmentId) => {
  console.log('📋 Checking appointment status...');
  
  try {
    const response = await apiRequest(`/api/appointments/${appointmentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const appointment = response.data;
    
    console.log('📊 Appointment Status:', {
      id: appointment._id,
      status: appointment.status,
      paymentStatus: appointment.payment?.status,
      paymentAmount: appointment.payment?.amount,
      transactionId: appointment.payment?.transactionId,
      paidAt: appointment.payment?.paidAt
    });
    
    return appointment;
  } catch (error) {
    console.error('❌ Failed to check appointment status:', error.message);
    throw error;
  }
};

// Manual payment verification
const verifyPaymentManually = async (appointmentId, paymentDetails) => {
  console.log('🔍 Manual payment verification...');
  
  try {
    // First, check current status
    const token = await testLogin();
    const beforeStatus = await testAppointmentStatus(token, appointmentId);
    
    console.log('Status before payment:', beforeStatus.status);
    console.log('Payment status before:', beforeStatus.payment?.status || 'none');
    
    // Verify payment
    const verificationResult = await testPaymentVerification(token, appointmentId, paymentDetails);
    
    // Check status after payment
    const afterStatus = await testAppointmentStatus(token, appointmentId);
    
    console.log('Status after payment:', afterStatus.status);
    console.log('Payment status after:', afterStatus.payment?.status || 'none');
    
    return {
      success: afterStatus.payment?.status === 'paid' && afterStatus.status === 'confirmed',
      beforeStatus,
      afterStatus,
      verificationResult
    };
    
  } catch (error) {
    console.error('❌ Manual verification failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Complete payment flow test
const testCompletePaymentFlow = async (appointmentId) => {
  console.log('🚀 Starting complete payment flow test...');
  console.log('Appointment ID:', appointmentId);
  
  try {
    // Step 1: Login
    const token = await testLogin();
    
    // Step 2: Check initial status
    const initialStatus = await testAppointmentStatus(token, appointmentId);
    
    // Step 3: Create payment order
    const orderData = await testCreateOrder(token, appointmentId);
    
    // Step 4: Verify payment
    const verificationResult = await testPaymentVerification(token, appointmentId, orderData);
    
    // Step 5: Check final status
    const finalStatus = await testAppointmentStatus(token, appointmentId);
    
    // Results
    const isSuccessful = finalStatus.payment?.status === 'paid' && finalStatus.status === 'confirmed';
    
    console.log('\n📊 TEST RESULTS:');
    console.log('=================');
    console.log('✅ Payment Successful:', isSuccessful);
    console.log('🔄 Status Change:', `${initialStatus.status} → ${finalStatus.status}`);
    console.log('💰 Payment Status:', `${initialStatus.payment?.status || 'none'} → ${finalStatus.payment?.status}`);
    console.log('🆔 Transaction ID:', finalStatus.payment?.transactionId);
    console.log('📅 Paid At:', finalStatus.payment?.paidAt);
    
    return {
      success: isSuccessful,
      initialStatus,
      finalStatus,
      orderData,
      verificationResult
    };
    
  } catch (error) {
    console.error('❌ Complete test failed:', error.message);
    return { success: false, error: error.message };
  }
};

// CLI interface
const main = async () => {
  const args = process.argv.slice(2);
  const command = args[0];
  const appointmentId = args[1];
  
  if (!command) {
    console.log('Usage:');
    console.log('  node payment-verification.js test <appointmentId>     # Test complete payment flow');
    console.log('  node payment-verification.js check <appointmentId>    # Check payment status');
    console.log('  node payment-verification.js verify <appointmentId>   # Manual verification');
    return;
  }
  
  switch (command) {
    case 'test':
      if (!appointmentId) {
        console.error('Please provide an appointment ID');
        return;
      }
      await testCompletePaymentFlow(appointmentId);
      break;
      
    case 'check':
      if (!appointmentId) {
        console.error('Please provide an appointment ID');
        return;
      }
      const token = await testLogin();
      await testAppointmentStatus(token, appointmentId);
      break;
      
    case 'verify':
      if (!appointmentId) {
        console.error('Please provide an appointment ID');
        return;
      }
      // Example usage for manual verification
      const orderData = { orderId: 'order_test123' };
      await verifyPaymentManually(appointmentId, orderData);
      break;
      
    default:
      console.error('Unknown command:', command);
  }
};

// Export functions for use in other scripts
module.exports = {
  testCompletePaymentFlow,
  verifyPaymentManually,
  testAppointmentStatus,
  testLogin,
  testCreateOrder,
  testPaymentVerification
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
