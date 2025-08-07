'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  MessageSquare,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  Volume2,
  VolumeX
} from 'lucide-react';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import toast from 'react-hot-toast';

export default function SimpleVideoCall() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState(null);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const callIntervalRef = useRef(null);

  // WebRTC Configuration with free STUN servers
  const pcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');
      const userData = localStorage.getItem('user');

      if (!token) {
        router.push('/login');
        return;
      }

      if (userData) {
        setUser(JSON.parse(userData));
      }
      setUserRole(role);
    };

    checkAuth();
    
    // Initialize video call
    initializeVideoCall();

    return () => {
      cleanup();
    };
  }, []);

  const initializeVideoCall = async () => {
    try {
      setConnectionStatus('Initializing...');
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection(pcConfig);
      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setIsInCall(true);
        setCallStartTime(Date.now());
        startCallTimer();
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // In a real implementation, send this to the other peer via signaling server
          console.log('ICE candidate:', event.candidate);
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        const state = peerConnection.connectionState;
        setConnectionStatus(state);
        
        if (state === 'connected') {
          setIsConnecting(false);
          setIsInCall(true);
          toast.success('Video call connected!');
        } else if (state === 'disconnected' || state === 'failed') {
          setIsInCall(false);
          toast.error('Call disconnected');
        }
      };

      setConnectionStatus('Ready');
      setError(null);

    } catch (error) {
      console.error('Failed to initialize video call:', error);
      setError('Failed to access camera/microphone. Please grant permissions and try again.');
      setConnectionStatus('Failed');
    }
  };

  const startCallTimer = () => {
    callIntervalRef.current = setInterval(() => {
      if (callStartTime) {
        setCallDuration(Math.floor((Date.now() - callStartTime) / 1000));
      }
    }, 1000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
        toast.success(audioTrack.enabled ? 'Microphone unmuted' : 'Microphone muted');
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
        toast.success(videoTrack.enabled ? 'Camera enabled' : 'Camera disabled');
      }
    }
  };

  const toggleSpeaker = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = speakerEnabled;
      setSpeakerEnabled(!speakerEnabled);
      toast.success(speakerEnabled ? 'Speaker muted' : 'Speaker enabled');
    }
  };

  const endCall = () => {
    cleanup();
    toast.success('Call ended');
    router.push(userRole === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    if (callIntervalRef.current) {
      clearInterval(callIntervalRef.current);
    }
    
    setIsInCall(false);
    setCallDuration(0);
  };

  const handleLogout = () => {
    cleanup();
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar user={user} userRole={userRole} onLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Video Call Error</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={initializeVideoCall}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.back()}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <DashboardNavbar user={user} userRole={userRole} onLogout={handleLogout} />
      
      <div className="relative h-[calc(100vh-80px)]">
        {/* Remote Video (Main) */}
        <div className="absolute inset-0">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover bg-gray-800"
          />
          
          {/* No remote video overlay */}
          {!isInCall && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold mb-2">Waiting for participant...</h2>
                <p className="text-gray-300">Connection Status: {connectionStatus}</p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-gray-600">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!videoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <VideoOff className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Call Info */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            {isInCall ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Connected • {formatDuration(callDuration)}</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 text-yellow-400" />
                <span>{connectionStatus}</span>
              </>
            )}
          </div>
        </div>

        {/* Control Panel */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4 bg-black bg-opacity-70 rounded-full px-6 py-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-3 rounded-full transition-colors ${
                audioEnabled 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-colors ${
                videoEnabled 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>

            {/* Speaker Toggle */}
            <button
              onClick={toggleSpeaker}
              className={`p-3 rounded-full transition-colors ${
                speakerEnabled 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {speakerEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>

            {/* End Call */}
            <button
              onClick={endCall}
              className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              <PhoneOff className="h-5 w-5" />
            </button>

            {/* Messages */}
            <button
              onClick={() => router.push('/messaging')}
              className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium">
            📹 Demo Video Call - For demonstration purposes
          </div>
        </div>
      </div>
    </div>
  );
}
