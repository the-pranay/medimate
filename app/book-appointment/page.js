'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Search,
  MapPin,
  Star,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { identifyPaymentError, getPaymentErrorMessage, razorpayConfig, supportInfo } from '../utils/paymentHelpers';

export default function BookAppointment() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [notes, setNotes] = useState('');

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/appointments/doctors');
        if (response.ok) {
          const data = await response.json();
          setDoctors(data.data || []);
        } else {
          setError('Failed to load doctors');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  const specializations = [
    'All Specializations',
    'Cardiologist',
    'Dermatologist',
    'Pediatrician',
    'Orthopedic',
    'Neurologist',
    'Gynecologist',
    'Psychiatrist'
  ];

  const appointmentTypes = [
    'Regular Checkup',
    'Follow-up',
    'Consultation',
    'Emergency',
    'Second Opinion'
  ];

  // Generate next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return dates;
  };

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM'
  ];

  const filteredDoctors = (doctors || []).filter(doctor => {
    // Filter out null/undefined doctors
    if (!doctor || typeof doctor !== 'object') return false;
    
    const matchesSearch = doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor?.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === '' || 
                                 selectedSpecialization === 'All Specializations' ||
                                 doctor?.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  useEffect(() => {
    // Check if user is logged in and fetch user data
    const userRole = localStorage.getItem('userRole');
    const userData = localStorage.getItem('user');
    
    if (!userRole) {
      router.push('/login');
      return;
    }
    
    // Set user data from localStorage if available
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [router]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(2);
  };

  const handleDateTimeSelect = () => {
    if (selectedDate && selectedTime && appointmentType) {
      setCurrentStep(3);
    }
  };

  const handleBookAppointment = async () => {
    // Validate required fields
    if (!selectedDoctor || !selectedDate || !selectedTime || !appointmentType) {
      setError('Please fill in all required fields');
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      setError('Please log in to book an appointment');
      router.push('/login');
      return;
    }

    // Ensure user data is available
    if (!user) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log('User data loaded:', parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }

    // Map appointment type to valid enum values
    const typeMapping = {
      'Regular Checkup': 'offline',
      'Follow-up': 'offline',
      'Consultation': 'offline',
      'Emergency': 'emergency',
      'Second Opinion': 'offline'
    };

    const appointmentData = {
      doctorId: selectedDoctor._id,
      date: selectedDate,
      time: selectedTime,
      reasonForVisit: appointmentType,
      symptoms: [],
      type: typeMapping[appointmentType] || 'offline',
      notes: notes,
      consultationFee: selectedDoctor.consultationFee || 500
    };

    try {
      console.log('Booking appointment:', appointmentData);
      
      // First, create the appointment
      const appointmentResponse = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      const appointmentResult = await appointmentResponse.json();
      
      if (!appointmentResponse.ok) {
        throw new Error(appointmentResult.message || `HTTP error! status: ${appointmentResponse.status}`);
      }

      if (!appointmentResult.success) {
        throw new Error(appointmentResult.message || 'Failed to create appointment');
      }

      const appointmentId = appointmentResult.data._id;

      // Create Razorpay order
      const paymentOrderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: appointmentId,
          amount: selectedDoctor.consultationFee,
          doctorId: selectedDoctor._id
        })
      });

      if (!paymentOrderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const paymentOrderResult = await paymentOrderResponse.json();
      
      if (!paymentOrderResult.success) {
        throw new Error(paymentOrderResult.message || 'Failed to create payment order');
      }

      // Get Razorpay key from the payment order response or use the public key
      const razorpayKey = paymentOrderResult.data.razorpayKey || 'rzp_test_3tENk4NwCrtnOC';
      
      if (!razorpayKey) {
        throw new Error('Payment configuration not available');
      }

      // Debug user data for prefill
      console.log('User data for payment prefill:', {
        user: user,
        name: user?.name || 'Patient',
        email: user?.email || 'patient@medimate.com',
        contact: user?.phone || user?.phoneNumber || '9999999999'
      });

      // Initialize Razorpay payment
      const options = {
        key: razorpayKey,
        amount: paymentOrderResult.data.amount,
        currency: 'INR',
        name: 'MediMate',
        description: `Consultation with Dr. ${selectedDoctor.name}`,
        order_id: paymentOrderResult.data.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId: appointmentId
              })
            });

            if (verifyResponse.ok) {
              const verifyResult = await verifyResponse.json();
              if (verifyResult.success) {
                router.push('/patient-dashboard?message=Appointment booked and paid successfully!');
              } else {
                throw new Error('Payment verification failed');
              }
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled by user');
          },
          ...razorpayConfig.modal
        },
        prefill: {
          name: user?.name || 'Patient',
          email: user?.email || 'patient@medimate.com',
          contact: user?.phone || user?.phoneNumber || '9999999999'
        },
        theme: razorpayConfig.theme,
        ...razorpayConfig.config
      };

      // Check if Razorpay is loaded
      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        
        // Handle payment errors - Enhanced error handling
        rzp.on('payment.failed', function (response) {
          console.error('Payment failed:', response.error);
          console.log('Full error response:', response);
          
          // Check specifically for international card errors
          const errorDescription = response.error?.description?.toLowerCase() || '';
          const errorReason = response.error?.reason?.toLowerCase() || '';
          const errorCode = response.error?.code || '';
          
          // Enhanced detection for international card errors
          if (errorDescription.includes('international') || 
              errorDescription.includes('foreign') ||
              errorReason.includes('international') ||
              errorDescription.includes('not supported') ||
              errorCode === 'BAD_REQUEST_ERROR' ||
              errorDescription.includes('card not supported') ||
              errorDescription.includes('issuer not supported')) {
            
            console.log('International card error detected');
            const errorInfo = getPaymentErrorMessage('international_card');
            setError(errorInfo);
            setShowPaymentError(true);
          } else {
            // Handle other payment errors
            console.log('Other payment error detected:', {
              code: errorCode,
              description: errorDescription,
              reason: errorReason
            });
            handlePaymentError(response);
          }
        });
        
        // Handle modal dismissal
        rzp.on('payment.cancel', function() {
          console.log('Payment cancelled by user');
        });
        
        rzp.open();
      } else {
        // Fallback: redirect to payment page or show error
        console.error('Razorpay SDK not loaded');
        alert('Payment gateway not available. Please try again.');
      }
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Error booking appointment: ' + error.message);
    }
  };

  // Payment error handlers
  const showInternationalCardError = () => {
    const errorInfo = getPaymentErrorMessage('international_card');
    setError(errorInfo);
    setShowPaymentError(true);
  };

  const showGenericPaymentError = (message) => {
    const errorInfo = getPaymentErrorMessage('generic_error', message);
    setError(errorInfo);
    setShowPaymentError(true);
  };

  const handlePaymentError = (errorResponse) => {
    const errorType = identifyPaymentError(errorResponse);
    const errorInfo = getPaymentErrorMessage(errorType, errorResponse?.error?.description);
    setError(errorInfo);
    setShowPaymentError(true);
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Payment Error Modal Component
  const PaymentErrorModal = () => {
    if (!showPaymentError) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-red-600">{error?.title || 'Payment Error'}</h3>
          </div>
          
          <p className="text-gray-700 mb-4">{error?.message}</p>
          
          {error?.suggestions && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">What you can do:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                {error.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Email: <a href={`mailto:${supportInfo.email}`} className="text-blue-600 hover:underline">{supportInfo.email}</a></p>
              <p>Phone: <span className="font-medium">{supportInfo.phone}</span></p>
              <p>WhatsApp: <span className="font-medium">{supportInfo.whatsapp}</span></p>
              <p className="text-xs text-gray-500 mt-2">{supportInfo.hours}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPaymentError(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowPaymentError(false);
                // Retry payment
                handleBookAppointment();
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= step 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Payment Error Modal */}
      <PaymentErrorModal />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-gray-600 mt-2">Find and book appointments with the best doctors</p>
        </div>

        {renderStepIndicator()}

        {/* Step 1: Select Doctor */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Select a Doctor</h2>
            
            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by doctor name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-3 border text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Doctors List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{doctor?.name || 'Doctor'}</h3>
                      <p className="text-sm text-gray-600">{doctor?.specialization || 'Specialist'}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {doctor?.rating || '0'} ({doctor?.reviews || '0'} reviews)
                        </span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {doctor?.location || 'Location not specified'}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">₹{doctor?.consultationFee || '0'}</p>
                      <p className="text-sm text-green-600">{doctor?.availability || 'Available'}</p>
                      <p className="text-xs text-gray-500">{doctor?.experience || '0'} years exp.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No doctors found matching your criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {currentStep === 2 && selectedDoctor && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Change Doctor
            </button>

            <div className="flex items-center mb-6">
              <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedDoctor?.name || 'Doctor'}</h2>
                <p className="text-gray-600">{selectedDoctor?.specialization || 'Specialist'}</p>
              </div>
            </div>

            {/* Appointment Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Appointment Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {appointmentTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setAppointmentType(type)}
                    className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                      appointmentType === type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Date
              </label>
              <div className="grid grid-cols-7 gap-2">
                {generateDates().map((dateObj) => (
                  <button
                    key={dateObj.date}
                    onClick={() => setSelectedDate(dateObj.date)}
                    className={`p-3 text-center rounded-lg border transition-colors ${
                      selectedDate === dateObj.date
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xs">{dateObj.day}</div>
                    <div className="font-semibold">{dateObj.dayNumber}</div>
                    <div className="text-xs">{dateObj.month}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Time
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && selectedTime && appointmentType && (
              <div className="flex justify-end">
                <button
                  onClick={handleDateTimeSelect}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Continue to Review
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Change Date/Time
            </button>

            <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Appointment</h2>

            {/* Appointment Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Doctor Details</h3>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedDoctor?.name || 'Doctor'}</p>
                      <p className="text-sm text-gray-600">{selectedDoctor?.specialization || 'Specialist'}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedDoctor?.location || 'Location not specified'}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Appointment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-800">Date:</span>
                      <span className="font-medium text-gray-800">{new Date(selectedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Time:</span>
                      <span className="font-medium text-gray-800">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Type:</span>
                      <span className="font-medium text-gray-800">{appointmentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Consultation Fee:</span>
                      <span className="font-medium text-gray-800">₹{selectedDoctor.consultationFee}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any specific symptoms or concerns you'd like to mention..."
              />
            </div>

            {/* Payment Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">Supported Payment Methods</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Indian Cards:</span>
                  <span>Visa, Mastercard, RuPay, American Express</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">UPI:</span>
                  <span>Google Pay, PhonePe, Paytm, BHIM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Net Banking:</span>
                  <span>All major Indian banks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Wallets:</span>
                  <span>Paytm, MobiKwik, Freecharge</span>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800 mb-1">International Cards</p>
                    <p className="text-amber-700">
                      International cards are not supported by Razorpay. If you're using an international card, 
                      please contact our support team for alternative payment arrangements.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <a 
                        href="mailto:support@medimate.com" 
                        className="inline-flex items-center text-xs bg-amber-600 text-white px-2 py-1 rounded hover:bg-amber-700 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Email Support
                      </a>
                      <a 
                        href="https://wa.me/919876543210" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">₹{selectedDoctor.consultationFee}</span>
              </div>
              
              <button
                onClick={handleBookAppointment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-lg"
              >
                Confirm Booking
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              By booking this appointment, you agree to our terms and conditions.
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
