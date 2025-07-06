// Environment validation utility for client-side
export const validateEnvironment = () => {
  const missingVars = [];
  const warnings = [];

  // Check required public environment variables
  if (!process.env.NEXT_PUBLIC_AGORA_APP_ID) {
    missingVars.push('NEXT_PUBLIC_AGORA_APP_ID');
  }

  if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
    missingVars.push('NEXT_PUBLIC_RAZORPAY_KEY_ID');
  }

  // Check if we're in development mode and provide helpful messages
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    if (missingVars.length > 0) {
      console.warn('🚨 Missing Environment Variables:', missingVars);
      console.warn('Video calling and payments may not work properly.');
      console.warn('Please check your .env.local file or Vercel environment variables.');
    }
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
    warnings
  };
};

// Agora configuration checker
export const checkAgoraConfig = () => {
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
  
  if (!appId) {
    return {
      isValid: false,
      error: 'Agora App ID is not configured. Video calls will not work.',
      suggestion: 'Add NEXT_PUBLIC_AGORA_APP_ID to your environment variables.'
    };
  }

  return {
    isValid: true,
    appId: appId
  };
};

// Razorpay configuration checker
export const checkRazorpayConfig = () => {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  
  if (!keyId) {
    return {
      isValid: false,
      error: 'Razorpay Key ID is not configured. Payments will not work.',
      suggestion: 'Add NEXT_PUBLIC_RAZORPAY_KEY_ID to your environment variables.'
    };
  }

  return {
    isValid: true,
    keyId: keyId
  };
};

// Usage in components:
// import { validateEnvironment, checkAgoraConfig } from '../utils/envValidator';
// 
// const config = checkAgoraConfig();
// if (!config.isValid) {
//   console.error(config.error);
//   // Show user-friendly error message
// }
