'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  MessageSquare, 
  Settings,
  Users,
  Clock,
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { checkAgoraConfig } from '../../lib/envValidator';

export default function VideoCallClient() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [remoteUser, setRemoteUser] = useState(null);
  const [error, setError] = useState(null);
  const [callStartTime, setCallStartTime] = useState(null);
  const [agoraClient, setAgoraClient] = useState(null);
  const [isAgoraLoaded, setIsAgoraLoaded] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callIntervalRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  useEffect(() => {
    // Check environment configuration
    const agoraConfig = checkAgoraConfig();
    if (!agoraConfig.isValid) {
      setError(`Configuration Error: ${agoraConfig.error}`);
      console.error(agoraConfig.error);
      console.error('Suggestion:', agoraConfig.suggestion);
      return;
    }

    // Initialize Agora client on the client side only
    const initAgoraClient = async () => {
      try {
        // Dynamic import to prevent SSR issues
        const { agoraVideoCall } = await import('../../lib/agora-client');
        setAgoraClient(agoraVideoCall);
        setIsAgoraLoaded(true);
      } catch (error) {
        console.error('Failed to load Agora SDK:', error);
        setError('Failed to load video calling service. Please check your internet connection.');
      }
    };
    
    initAgoraClient();
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      const userData = localStorage.getItem('user');
      const urlParams = new URLSearchParams(window.location.search);
      const appointmentIdParam = urlParams.get('appointmentId');

      if (!token) {
        router.push('/login');
        return;
      }

      if (!appointmentIdParam) {
        router.push('/patient-dashboard');
        return;
      }

      if (userData) {
        setUser(JSON.parse(userData));
      }

      setUserRole(userRole);
      setAppointmentId(appointmentIdParam);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  useEffect(() => {
    if (isInCall && callStartTime) {
      callIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current);
      }
    }

    return () => {
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current);
      }
    };
  }, [isInCall, callStartTime]);

  const fetchAppointmentDetails = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const appointmentData = await response.json();
        if (appointmentData.success) {
          setAppointment(appointmentData.data);
        } else {
          setError(`Failed to fetch appointment: ${appointmentData.message}`);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(`Failed to fetch appointment details: ${errorData.message || response.status}`);
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
      setError('Failed to fetch appointment details');
    }
  };

  const startCall = async () => {
    if (!agoraClient || !isAgoraLoaded) {
      setError('Video calling service not ready');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      // Get Agora token
      const tokenResponse = await fetch('/api/video/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          appointmentId: appointmentId,
          channelName: `appointment_${appointmentId}`,
          uid: user.id || user._id || Date.now()
        })
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.message || `Failed to get video token: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      const { token: agoraToken } = tokenData;

      // Start the call in the backend
      const startResponse = await fetch(`/api/video/start/${appointmentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!startResponse.ok) {
        const errorData = await startResponse.json();
        throw new Error(errorData.message || `Failed to start video call: ${startResponse.status}`);
      }

      // Join the Agora channel
      await agoraClient.joinCall(
        `appointment_${appointmentId}`,
        agoraToken,
        user.id
      );

      // Play local video
      if (localVideoRef.current) {
        await agoraClient.playLocalVideo(localVideoRef.current);
      }

      // Set up remote user handler
      agoraClient.onRemoteUserJoined = (user) => {
        setRemoteUser(user);
        if (remoteVideoRef.current) {
          agoraClient.playRemoteVideo(user.uid, remoteVideoRef.current);
        }
      };

      agoraClient.onRemoteUserLeft = (user) => {
        setRemoteUser(null);
      };

      setIsInCall(true);
      setCallStartTime(Date.now());
      setCallDuration(0);

    } catch (error) {
      console.error('Error starting call:', error);
      setError(error.message || 'Failed to start video call');
    } finally {
      setIsConnecting(false);
    }
  };

  const endCall = async () => {
    try {
      if (agoraClient) {
        await agoraClient.leaveCall();
      }

      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      // End the call in the backend
      await fetch(`/api/video/end/${appointmentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setIsInCall(false);
      setCallStartTime(null);
      setCallDuration(0);
      setRemoteUser(null);

      // Redirect back to dashboard
      router.push(user?.role === 'patient' ? '/patient-dashboard' : '/doctor-dashboard');

    } catch (error) {
      console.error('Error ending call:', error);
      setError('Failed to end call properly');
    }
  };

  const toggleAudio = async () => {
    if (agoraClient && isInCall) {
      try {
        await agoraClient.toggleAudio();
        setAudioEnabled(!audioEnabled);
      } catch (error) {
        console.error('Error toggling audio:', error);
      }
    }
  };

  const toggleVideo = async () => {
    if (agoraClient && isInCall) {
      try {
        await agoraClient.toggleVideo();
        setVideoEnabled(!videoEnabled);
      } catch (error) {
        console.error('Error toggling video:', error);
      }
    }
  };

  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallStatus = () => {
    if (isConnecting) return 'Connecting...';
    if (isInCall && remoteUser) return 'Connected';
    if (isInCall) return 'Waiting for other participant...';
    return 'Ready to start';
  };

  const getStatusColor = () => {
    if (isConnecting) return 'text-yellow-600';
    if (isInCall && remoteUser) return 'text-green-600';
    if (isInCall) return 'text-blue-600';
    return 'text-gray-600';
  };

  if (!isAgoraLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar user={user} userRole={userRole} onLogout={handleLogout} />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading video calling service...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar user={user} userRole={userRole} onLogout={handleLogout} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Video Consultation</h1>
              {appointment && (
                <p className="text-gray-600 mt-1">
                  {user?.role === 'patient' ? `Dr. ${appointment.doctor?.name}` : `Patient: ${appointment.patient?.name}`}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {isInCall ? formatCallDuration(callDuration) : '00:00'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${
                  isInCall && remoteUser ? 'bg-green-500' : 
                  isInCall ? 'bg-yellow-500' : 
                  'bg-gray-400'
                }`}></div>
                <span className={`text-sm ${getStatusColor()}`}>
                  {getCallStatus()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Video Call Interface */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Remote Video */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              <div ref={remoteVideoRef} className="w-full h-full"></div>
              
              {!remoteUser && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-75">
                      {isInCall ? 'Waiting for other participant...' : 'Remote video will appear here'}
                    </p>
                  </div>
                </div>
              )}
              
              {remoteUser && (
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                  {user?.role === 'patient' ? 'Doctor' : 'Patient'}
                </div>
              )}
            </div>

            {/* Local Video */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              <div ref={localVideoRef} className="w-full h-full"></div>
              
              {!videoEnabled && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <VideoOff className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                You
              </div>
              
              {!audioEnabled && (
                <div className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full">
                  <MicOff className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>

          {/* Call Controls */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            {isInCall ? (
              <>
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full transition-colors ${
                    audioEnabled 
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {audioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                </button>
                
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full transition-colors ${
                    videoEnabled 
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {videoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                </button>
                
                <button
                  onClick={endCall}
                  className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  <PhoneOff className="h-6 w-6" />
                </button>
              </>
            ) : (
              <button
                onClick={startCall}
                disabled={isConnecting || !isAgoraLoaded}
                className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Phone className="h-5 w-5 mr-2" />
                    Start Video Call
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Call Information */}
        {appointment && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-medium">
                  {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium">{appointment.duration || '30'} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium">Video Consultation</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
