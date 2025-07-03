// Razorpay Integration for MediMate
import { paymentAPI } from '../lib/api';

// Initialize Razorpay (add to your HTML head or load dynamically)
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Razorpay Payment Integration
export const processRazorpayPayment = async (appointmentData) => {
  try {
    // Load Razorpay script
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      throw new Error('Razorpay SDK failed to load');
    }

    // Create order on backend
    const orderResponse = await paymentAPI.createRazorpayOrder({
      amount: appointmentData.consultationFee,
      appointmentId: appointmentData.id,
      patientInfo: appointmentData.patient,
    });

    if (!orderResponse.success) {
      throw new Error(orderResponse.message);
    }

    const { order } = orderResponse.data;

    // Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'MediMate',
      description: `Consultation with ${appointmentData.doctorName}`,
      image: '/logo.png',
      order_id: order.id,
      handler: async function (response) {
        try {
          // Verify payment on backend
          const verifyResponse = await paymentAPI.verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            appointmentId: appointmentData.id,
          });

          if (verifyResponse.success) {
            // Payment successful
            return {
              success: true,
              paymentId: response.razorpay_payment_id,
              message: 'Payment successful',
            };
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          return {
            success: false,
            message: 'Payment verification failed',
          };
        }
      },
      prefill: {
        name: appointmentData.patient.name,
        email: appointmentData.patient.email,
        contact: appointmentData.patient.phone,
      },
      theme: {
        color: '#2563eb', // Medical blue theme
      },
      modal: {
        ondismiss: function () {
          console.log('Payment cancelled by user');
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

  } catch (error) {
    console.error('Razorpay payment error:', error);
    return {
      success: false,
      message: error.message || 'Payment failed',
    };
  }
};

// Usage in appointment booking
export const bookAppointmentWithPayment = async (appointmentData) => {
  try {
    // First create the appointment
    const bookingResponse = await paymentAPI.bookAppointment(appointmentData);
    
    if (!bookingResponse.success) {
      throw new Error(bookingResponse.message);
    }

    // Then process payment
    const paymentResult = await processRazorpayPayment({
      ...appointmentData,
      id: bookingResponse.data.appointmentId,
    });

    return paymentResult;
  } catch (error) {
    console.error('Appointment booking with payment error:', error);
    return {
      success: false,
      message: error.message || 'Booking failed',
    };
  }
};
