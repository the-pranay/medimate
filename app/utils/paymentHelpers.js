// Payment utility functions for handling Razorpay errors and alternative payment methods

export const PAYMENT_ERROR_TYPES = {
  INTERNATIONAL_CARD: 'international_card',
  INSUFFICIENT_FUNDS: 'insufficient_funds',
  CARD_DECLINED: 'card_declined',
  NETWORK_ERROR: 'network_error',
  GENERIC_ERROR: 'generic_error'
};

export const identifyPaymentError = (errorResponse) => {
  const error = errorResponse?.error;
  const description = error?.description?.toLowerCase() || '';
  const code = error?.code || '';

  if (description.includes('international') || description.includes('foreign')) {
    return PAYMENT_ERROR_TYPES.INTERNATIONAL_CARD;
  }
  
  if (description.includes('insufficient') || description.includes('balance')) {
    return PAYMENT_ERROR_TYPES.INSUFFICIENT_FUNDS;
  }
  
  if (description.includes('declined') || description.includes('denied')) {
    return PAYMENT_ERROR_TYPES.CARD_DECLINED;
  }
  
  if (code === 'NETWORK_ERROR' || description.includes('network') || description.includes('timeout')) {
    return PAYMENT_ERROR_TYPES.NETWORK_ERROR;
  }
  
  return PAYMENT_ERROR_TYPES.GENERIC_ERROR;
};

export const getPaymentErrorMessage = (errorType, originalMessage = '') => {
  switch (errorType) {
    case PAYMENT_ERROR_TYPES.INTERNATIONAL_CARD:
      return {
        title: 'International Card Not Supported',
        message: 'International cards are not supported by Razorpay. Please use an Indian card or alternative payment method.',
        suggestions: [
          'Use Indian debit/credit cards (Visa, Mastercard, RuPay)',
          'Pay via UPI (Google Pay, PhonePe, Paytm)',
          'Use Net Banking from any Indian bank',
          'Pay via digital wallets (Paytm, MobiKwik)',
          'Contact support for international payment assistance'
        ]
      };
      
    case PAYMENT_ERROR_TYPES.INSUFFICIENT_FUNDS:
      return {
        title: 'Insufficient Funds',
        message: 'Your card has insufficient balance to complete this payment.',
        suggestions: [
          'Check your account balance',
          'Try a different card',
          'Use UPI or net banking',
          'Contact your bank for assistance'
        ]
      };
      
    case PAYMENT_ERROR_TYPES.CARD_DECLINED:
      return {
        title: 'Card Declined',
        message: 'Your card was declined by the bank. This may be due to security restrictions.',
        suggestions: [
          'Check if online payments are enabled',
          'Verify card details are correct',
          'Try a different card',
          'Contact your bank to enable online transactions',
          'Use UPI or net banking as alternative'
        ]
      };
      
    case PAYMENT_ERROR_TYPES.NETWORK_ERROR:
      return {
        title: 'Network Error',
        message: 'Payment failed due to network connectivity issues.',
        suggestions: [
          'Check your internet connection',
          'Try again in a few moments',
          'Use a different device or browser',
          'Contact support if the issue persists'
        ]
      };
      
    default:
      return {
        title: 'Payment Failed',
        message: originalMessage || 'Payment could not be completed. Please try again.',
        suggestions: [
          'Try again with the same payment method',
          'Use a different card or payment method',
          'Check your internet connection',
          'Contact support if the issue persists'
        ]
      };
  }
};

export const razorpayConfig = {
  // Enhanced configuration for better payment experience
  config: {
    display: {
      blocks: {
        banks: {
          name: 'Pay using Net Banking',
          instruments: [
            {
              method: 'netbanking'
            }
          ]
        },
        upi: {
          name: 'Pay using UPI',
          instruments: [
            {
              method: 'upi'
            }
          ]
        },
        card: {
          name: 'Pay using Cards',
          instruments: [
            {
              method: 'card'
            }
          ]
        },
        wallet: {
          name: 'Pay using Wallets',
          instruments: [
            {
              method: 'wallet'
            }
          ]
        }
      },
      sequence: ['block.upi', 'block.card', 'block.banks', 'block.wallet'],
      preferences: {
        show_default_blocks: true
      }
    }
  },
  theme: {
    color: '#3B82F6',
    backdrop_color: 'rgba(0, 0, 0, 0.6)'
  },
  modal: {
    escape: true,
    backdrop_close: false
  }
};

export const supportInfo = {
  email: 'support@medimate.com',
  phone: '+91-8000-XXX-XXX',
  whatsapp: '+91-8000-XXX-XXX',
  hours: 'Monday to Friday, 9 AM to 6 PM IST'
};
