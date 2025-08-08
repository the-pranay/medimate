'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../../components/ui/DashboardNavbar';
import { Video, Phone, Users, Clock, VideoIcon, PhoneCall } from 'lucide-react';

export default function PatientVideoCall() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      const userData = localStorage.getItem('user');

      if (!token || userRole !== 'patient') {
        router.push('/login');
        return;
      }

      if (userData) {
        setUser(JSON.parse(userData));
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

  const handleStartVideoCall = () => {
    // Navigate to the main video call page
    router.push('/video-call');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar user={user} userRole="patient" onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Video Consultation</h1>
          <p className="text-gray-600 mt-2">Connect with your doctor through video call</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Video Call Interface */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="w-12 h-12 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready for Video Consultation</h2>
              <p className="text-gray-600 mb-8">
                Start a video call with your doctor for face-to-face consultation
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Video className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">HD Video Quality</h3>
                    <p className="text-sm text-gray-600">Crystal clear video calls</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Audio Call Option</h3>
                    <p className="text-sm text-gray-600">Voice-only consultation</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Secure Connection</h3>
                    <p className="text-sm text-gray-600">End-to-end encrypted</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Available 24/7</h3>
                    <p className="text-sm text-gray-600">Connect anytime</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleStartVideoCall}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Video className="w-5 h-5" />
                  <span>Start Video Call</span>
                </button>
                
                <p className="text-sm text-gray-500">
                  Make sure your camera and microphone are working properly before starting the call
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Before You Start</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                <span>Ensure you have a stable internet connection</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                <span>Allow camera and microphone access when prompted</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                <span>Find a quiet, well-lit place for your consultation</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                <span>Have your medical history and current medications ready</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
