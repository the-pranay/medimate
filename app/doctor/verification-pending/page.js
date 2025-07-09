'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Clock, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  Mail, 
  Phone, 
  FileText,
  Stethoscope,
  RefreshCw
} from 'lucide-react';

export default function DoctorVerificationPending() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      const userData = localStorage.getItem('user');

      if (!token || userRole !== 'doctor') {
        router.push('/login');
        return;
      }

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // If doctor is already verified, redirect to dashboard
        if (parsedUser.isVerified) {
          router.push('/doctor/dashboard');
          return;
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  const checkVerificationStatus = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = data.data;
        
        // Update localStorage with latest user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // If verified, redirect to dashboard
        if (updatedUser.isVerified) {
          router.push('/doctor/dashboard');
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">MediMate</h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Account Verification Pending
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for registering as a doctor on MediMate! Your account is currently being reviewed by our admin team.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-900">Why do we verify doctors?</h3>
            </div>
            <p className="text-blue-800 text-sm">
              We verify all healthcare professionals to ensure patient safety and maintain the highest standards of care on our platform.
            </p>
          </div>
          
          {user && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Application Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <span className="text-gray-500">Name:</span>
                  <span className="ml-2 text-gray-900 font-medium">Dr. {user.name}</span>
                </div>
                <div className="text-left">
                  <span className="text-gray-500">Email:</span>
                  <span className="ml-2 text-gray-900">{user.email}</span>
                </div>
                <div className="text-left">
                  <span className="text-gray-500">Specialization:</span>
                  <span className="ml-2 text-gray-900">{user.specialization}</span>
                </div>
                <div className="text-left">
                  <span className="text-gray-500">License Number:</span>
                  <span className="ml-2 text-gray-900 font-mono">{user.licenseNumber}</span>
                </div>
                <div className="text-left">
                  <span className="text-gray-500">Experience:</span>
                  <span className="ml-2 text-gray-900">{user.experience} years</span>
                </div>
                <div className="text-left">
                  <span className="text-gray-500">Registered:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center justify-center text-yellow-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">Verification typically takes 1-2 business days</span>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                <span>Email notification upon approval</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                <span>SMS updates available</span>
              </div>
            </div>
            
            <button
              onClick={checkVerificationStatus}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Status
            </button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@medimate.com" className="text-blue-600 hover:text-blue-500">
                support@medimate.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
