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
import { agoraVideoCall } from '../../lib/agora';

export default function VideoCall() {
  const router = useRouter();
  const [user, setUser] = useState(null);
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
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callIntervalRef = useRef(null);

  useEffect(() => {
    // Initialize Agora client on the client side only
    const initAgoraClient = async () => {
      if (typeof window !== 'undefined') {
        const { agoraVideoCall } = await import('../../lib/agora');
        setAgoraClient(agoraVideoCall);
      }
    };
    
    initAgoraClient();
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') return;
      
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
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppointment(data.data);
      } else {
        setError('Failed to fetch appointment details');
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
      setError('Failed to fetch appointment details');
    }
  };

  const startCall = async () => {
    if (!appointmentId || isConnecting || !agoraClient) return;

    setIsConnecting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      // Start the call on the server
      const startResponse = await fetch(`/api/video/start/${appointmentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!startResponse.ok) {
        throw new Error('Failed to start call');
      }

      // Get Agora token
      const channelName = `appointment_${appointmentId}`;
      const uid = parseInt(user?.id || Date.now().toString().slice(-6));

      const tokenResponse = await fetch('/api/video/token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId,
          channelName,
          uid,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get video token');
      }

      const tokenData = await tokenResponse.json();
      
      // Initialize and join Agora call
      await agoraClient.init();
      
      // Set up event callbacks
      agoraClient.setEventCallbacks({
        onRemoteUserJoined: (remoteUser) => {
          setRemoteUser(remoteUser);
          if (remoteUser.videoTrack && remoteVideoRef.current) {
            remoteUser.videoTrack.play(remoteVideoRef.current);
          }
        },
        onRemoteUserLeft: (remoteUser) => {
          setRemoteUser(null);
        },
        onUserJoined: (user) => {
          console.log('User joined:', user.uid);
        },
        onUserLeft: (user) => {
          console.log('User left:', user.uid);
        },
      });

      const result = await agoraClient.joinCall(
        channelName,
        tokenData.data.token,
        uid
      );

      // Play local video
      if (result.localVideoTrack && localVideoRef.current) {
        result.localVideoTrack.play(localVideoRef.current);
      }

      setIsInCall(true);
      setCallStartTime(Date.now());
      
    } catch (error) {
      console.error('Error starting call:', error);
      setError(error.message || 'Failed to start video call');
    } finally {
      setIsConnecting(false);
    }
  };

  const endCall = async () => {
    if (!agoraClient) return;
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      // Leave Agora call
      await agoraClient.leaveCall();
      
      // End call on server
      await fetch(`/api/video/end/${appointmentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callDuration: callDuration,
          callNotes: 'Call completed',
        }),
      });

      setIsInCall(false);
      setRemoteUser(null);
      setCallDuration(0);
      setCallStartTime(null);
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/patient-dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error ending call:', error);
      setError('Failed to end call properly');
    }
  };

  const toggleAudio = async () => {
    if (!agoraClient) return;
    
    try {
      const enabled = await agoraClient.toggleAudio();
      setAudioEnabled(enabled);
    } catch (error) {
      console.error('Error toggling audio:', error);
    }
  };

  const toggleVideo = async () => {
    if (!agoraClient) return;
    
    try {
      const enabled = await agoraClient.toggleVideo();
      setVideoEnabled(enabled);
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Call Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/patient-dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Video className="h-6 w-6" />
          <div>
            <h1 className="text-lg font-semibold">Video Consultation</h1>
            {appointment && (
              <p className="text-sm text-gray-300">
                {user?.role === 'patient' ? 
                  `Dr. ${appointment.doctor?.name}` : 
                  appointment.patient?.name
                }
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isInCall && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-mono">{formatTime(callDuration)}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isInCall ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">
              {isInCall ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Remote Video */}
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            {remoteUser ? (
              <div className="w-full h-full relative">
                <div 
                  ref={remoteVideoRef}
                  className="w-full h-full bg-gray-700 rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm">
                  {user?.role === 'patient' ? 'Doctor' : 'Patient'}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <Users className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">Waiting for participant to join...</p>
              </div>
            )}
          </div>

          {/* Local Video (Picture-in-Picture) */}
          {isInCall && (
            <div className="absolute bottom-4 right-4 w-64 h-48 bg-gray-700 rounded-lg overflow-hidden">
              <div 
                ref={localVideoRef}
                className="w-full h-full"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                You
              </div>
            </div>
          )}
        </div>

        {/* Chat Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="h-5 w-5 text-gray-400" />
            <h3 className="text-white font-medium">Chat</h3>
          </div>
          
          <div className="h-96 bg-gray-700 rounded-lg p-4 mb-4 overflow-y-auto">
            <div className="text-center text-gray-400 text-sm">
              Chat functionality will be available during the call
            </div>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex items-center justify-center space-x-4">
          {!isInCall ? (
            <button
              onClick={startCall}
              disabled={isConnecting}
              className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Video className="h-5 w-5" />
              <span>{isConnecting ? 'Connecting...' : 'Start Call'}</span>
            </button>
          ) : (
            <>
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full transition-colors ${
                  audioEnabled ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {audioEnabled ? <Mic className="h-5 w-5 text-white" /> : <MicOff className="h-5 w-5 text-white" />}
              </button>
              
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition-colors ${
                  videoEnabled ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {videoEnabled ? <Video className="h-5 w-5 text-white" /> : <VideoOff className="h-5 w-5 text-white" />}
              </button>
              
              <button
                onClick={endCall}
                className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <PhoneOff className="h-5 w-5" />
                <span>End Call</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
