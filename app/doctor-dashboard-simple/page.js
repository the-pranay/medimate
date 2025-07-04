'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DoctorDashboard() {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctor data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('🔍 Simple Doctor Dashboard: Starting...');
        
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const userRole = localStorage.getItem('userRole');
        const userStr = localStorage.getItem('user');
        
        console.log('🔍 Simple Doctor Dashboard: Auth check', {
          hasToken: !!token,
          userRole: userRole,
          hasUser: !!userStr
        });
        
        // Try to get role from stored user object if userRole is not set
        let role = userRole;
        if (!role && userStr) {
          try {
            const user = JSON.parse(userStr);
            role = user.role;
            console.log('🔍 Simple Doctor Dashboard: Got role from user:', role);
          } catch (e) {
            console.error('🔍 Simple Doctor Dashboard: Error parsing user:', e);
          }
        }
        
        if (!token) {
          console.log('🔍 Simple Doctor Dashboard: No token, redirecting to login');
          router.push('/login');
          return;
        }
        
        if (role && role !== 'doctor') {
          console.log('🔍 Simple Doctor Dashboard: User is not doctor, redirecting');
          router.push(role === 'patient' ? '/patient-dashboard' : '/login');
          return;
        }
        
        console.log('🔍 Simple Doctor Dashboard: Auth passed, fetching profile...');

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        // Fetch doctor profile
        const doctorResponse = await fetch('/api/users/profile', { headers });
        if (doctorResponse.ok) {
          const doctorData = await doctorResponse.json();
          console.log('🔍 Simple Doctor Dashboard: Profile response:', doctorData);
          if (doctorData.success) {
            setDoctor(doctorData.data);
            
            // Double-check role
            if (doctorData.data.role !== 'doctor') {
              console.log('🔍 Simple Doctor Dashboard: Profile shows wrong role, redirecting');
              router.push(doctorData.data.role === 'patient' ? '/patient-dashboard' : '/login');
              return;
            }
          } else {
            throw new Error(doctorData.message || 'Failed to fetch profile');
          }
        } else {
          throw new Error(`Profile API returned ${doctorResponse.status}`);
        }

      } catch (error) {
        console.error('🔍 Simple Doctor Dashboard: Error:', error);
        setError(error.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  console.log('🔍 Simple Doctor Dashboard: Rendering', {
    loading,
    error,
    doctor: doctor ? doctor.name : 'null'
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your doctor dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4 font-semibold">Error: {error}</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button 
              onClick={handleLogout} 
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-green-200 mb-8">
          <div className="flex justify-between items-center p-6">
            <div>
              <h1 className="text-3xl font-bold text-green-600">
                👨‍⚕️ Doctor Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, Dr. {doctor?.name || 'Doctor'}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="bg-white rounded-lg shadow-sm border border-green-200 mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-800">{doctor?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-800">{doctor?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Specialization</p>
                <p className="font-medium text-gray-800">{doctor?.specialization || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">License Number</p>
                <p className="font-medium text-gray-800">{doctor?.licenseNumber || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Dashboard Successfully Loaded!</h3>
              <p className="text-green-700 mt-1">
                Your doctor dashboard is working properly. Registration and authentication flow is complete.
              </p>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Debug Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Token Status</p>
              <p className="font-medium text-green-600">✓ Valid</p>
            </div>
            <div>
              <p className="text-gray-600">User Role</p>
              <p className="font-medium text-green-600">✓ Doctor</p>
            </div>
            <div>
              <p className="text-gray-600">Profile Loaded</p>
              <p className="font-medium text-green-600">✓ Success</p>
            </div>
            <div>
              <p className="text-gray-600">Dashboard Status</p>
              <p className="font-medium text-green-600">✓ Working</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
