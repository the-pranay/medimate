// Agora Video Calling Integration for MediMate
import AgoraRTC from 'agora-rtc-sdk-ng';

class AgoraVideoCall {
  constructor() {
    this.client = null;
    this.localAudioTrack = null;
    this.localVideoTrack = null;
    this.remoteUsers = {};
    this.joined = false;
  }

  // Initialize Agora client
  async init() {
    try {
      this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      
      // Event listeners
      this.client.on('user-published', this.handleUserPublished.bind(this));
      this.client.on('user-unpublished', this.handleUserUnpublished.bind(this));
      this.client.on('user-joined', this.handleUserJoined.bind(this));
      this.client.on('user-left', this.handleUserLeft.bind(this));

      console.log('Agora client initialized');
    } catch (error) {
      console.error('Failed to initialize Agora client:', error);
      throw error;
    }
  }

  // Join video call
  async joinCall(channelName, token, uid) {
    try {
      if (!this.client) {
        await this.init();
      }

      // Join the channel
      await this.client.join(
        process.env.NEXT_PUBLIC_AGORA_APP_ID,
        channelName,
        token,
        uid
      );

      // Create local tracks
      [this.localAudioTrack, this.localVideoTrack] = 
        await AgoraRTC.createMicrophoneAndCameraTracks();

      // Publish local tracks
      await this.client.publish([this.localAudioTrack, this.localVideoTrack]);

      this.joined = true;
      console.log('Successfully joined video call');

      return {
        success: true,
        localVideoTrack: this.localVideoTrack,
        localAudioTrack: this.localAudioTrack,
      };
    } catch (error) {
      console.error('Failed to join call:', error);
      throw error;
    }
  }

  // Leave video call
  async leaveCall() {
    try {
      if (this.localAudioTrack) {
        this.localAudioTrack.stop();
        this.localAudioTrack.close();
      }
      
      if (this.localVideoTrack) {
        this.localVideoTrack.stop();
        this.localVideoTrack.close();
      }

      if (this.client && this.joined) {
        await this.client.leave();
      }

      this.joined = false;
      this.remoteUsers = {};
      
      console.log('Successfully left video call');
    } catch (error) {
      console.error('Failed to leave call:', error);
      throw error;
    }
  }

  // Handle remote user published
  async handleUserPublished(user, mediaType) {
    try {
      await this.client.subscribe(user, mediaType);
      
      if (mediaType === 'video') {
        this.remoteUsers[user.uid] = user;
        this.onRemoteUserJoined && this.onRemoteUserJoined(user);
      }
      
      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    } catch (error) {
      console.error('Failed to handle user published:', error);
    }
  }

  // Handle remote user unpublished
  handleUserUnpublished(user, mediaType) {
    if (mediaType === 'video') {
      delete this.remoteUsers[user.uid];
      this.onRemoteUserLeft && this.onRemoteUserLeft(user);
    }
  }

  // Handle user joined
  handleUserJoined(user) {
    console.log('User joined:', user.uid);
    this.onUserJoined && this.onUserJoined(user);
  }

  // Handle user left
  handleUserLeft(user) {
    console.log('User left:', user.uid);
    delete this.remoteUsers[user.uid];
    this.onUserLeft && this.onUserLeft(user);
  }

  // Toggle audio
  async toggleAudio() {
    if (this.localAudioTrack) {
      const enabled = this.localAudioTrack.enabled;
      await this.localAudioTrack.setEnabled(!enabled);
      return !enabled;
    }
    return false;
  }

  // Toggle video
  async toggleVideo() {
    if (this.localVideoTrack) {
      const enabled = this.localVideoTrack.enabled;
      await this.localVideoTrack.setEnabled(!enabled);
      return !enabled;
    }
    return false;
  }

  // Set event callbacks
  setEventCallbacks(callbacks) {
    this.onRemoteUserJoined = callbacks.onRemoteUserJoined;
    this.onRemoteUserLeft = callbacks.onRemoteUserLeft;
    this.onUserJoined = callbacks.onUserJoined;
    this.onUserLeft = callbacks.onUserLeft;
  }
}

// Export singleton instance
export const agoraVideoCall = new AgoraVideoCall();

// React hook for video calling
export const useAgoraVideoCall = () => {
  const [isInCall, setIsInCall] = React.useState(false);
  const [localTracks, setLocalTracks] = React.useState(null);
  const [remoteUsers, setRemoteUsers] = React.useState({});
  const [audioEnabled, setAudioEnabled] = React.useState(true);
  const [videoEnabled, setVideoEnabled] = React.useState(true);

  const joinCall = async (channelName, token, uid) => {
    try {
      const result = await agoraVideoCall.joinCall(channelName, token, uid);
      setLocalTracks(result);
      setIsInCall(true);
      return result;
    } catch (error) {
      console.error('Join call error:', error);
      throw error;
    }
  };

  const leaveCall = async () => {
    try {
      await agoraVideoCall.leaveCall();
      setIsInCall(false);
      setLocalTracks(null);
      setRemoteUsers({});
    } catch (error) {
      console.error('Leave call error:', error);
    }
  };

  const toggleAudio = async () => {
    const enabled = await agoraVideoCall.toggleAudio();
    setAudioEnabled(enabled);
  };

  const toggleVideo = async () => {
    const enabled = await agoraVideoCall.toggleVideo();
    setVideoEnabled(enabled);
  };

  React.useEffect(() => {
    agoraVideoCall.setEventCallbacks({
      onRemoteUserJoined: (user) => {
        setRemoteUsers(prev => ({ ...prev, [user.uid]: user }));
      },
      onRemoteUserLeft: (user) => {
        setRemoteUsers(prev => {
          const updated = { ...prev };
          delete updated[user.uid];
          return updated;
        });
      },
    });
  }, []);

  return {
    isInCall,
    localTracks,
    remoteUsers,
    audioEnabled,
    videoEnabled,
    joinCall,
    leaveCall,
    toggleAudio,
    toggleVideo,
  };
};
