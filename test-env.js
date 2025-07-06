// Test environment variables loading
console.log('🔍 Environment Variables Test:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_AGORA_APP_ID:', process.env.NEXT_PUBLIC_AGORA_APP_ID);
console.log('NEXT_PUBLIC_RAZORPAY_KEY_ID:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

// Export a function to test in components
export const testEnvVars = () => {
  const agoraId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
  const razorpayId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  
  console.log('🧪 Testing environment variables:');
  console.log('Agora App ID:', agoraId ? 'SET' : 'NOT SET');
  console.log('Razorpay Key ID:', razorpayId ? 'SET' : 'NOT SET');
  
  return {
    agoraId,
    razorpayId
  };
};

export default testEnvVars;
