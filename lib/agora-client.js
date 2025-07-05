// Agora Video Calling Integration for MediMate - Client-side only
// This module should only be imported dynamically to prevent SSR issues

class AgoraVideoCall {
  constructor() {
    this.client = null;
    this.localAudioTrack = null;
    this.localVideoTrack = null;
    this.remoteUsers = {};
    this.joined = false;
    this.AgoraRTC = null;
  }

  // Initialize Agora client
  async init() {
    try {
      // Dynamic import of Agora SDK to prevent SSR issues
      const AgoraRTC = await import('agora-rtc-sdk-ng');
      this.AgoraRTC = AgoraRTC.default;
      
      this.client = this.AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      
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
        await this.AgoraRTC.createMicrophoneAndCameraTracks();

      // Publish local tracks
      await this.client.publish([this.localAudioTrack, this.localVideoTrack]);

      this.joined = true;
      console.log('Successfully joined video call');

    } catch (error) {
      console.error('Failed to join video call:', error);
      throw error;
    }
  }

  // Leave video call
  async leaveCall() {
    try {
      if (this.localAudioTrack) {
        this.localAudioTrack.close();
        this.localAudioTrack = null;
      }

      if (this.localVideoTrack) {
        this.localVideoTrack.close();
        this.localVideoTrack = null;
      }

      if (this.client && this.joined) {
        await this.client.leave();
        this.joined = false;
      }

      this.remoteUsers = {};
      console.log('Successfully left video call');

    } catch (error) {
      console.error('Failed to leave video call:', error);
      throw error;
    }
  }

  // Play local video
  async playLocalVideo(element) {
    try {
      if (this.localVideoTrack && element) {
        this.localVideoTrack.play(element);
      }
    } catch (error) {
      console.error('Failed to play local video:', error);
    }
  }

  // Play remote video
  async playRemoteVideo(uid, element) {
    try {
      const remoteUser = this.remoteUsers[uid];
      if (remoteUser && remoteUser.videoTrack && element) {
        remoteUser.videoTrack.play(element);
      }
    } catch (error) {
      console.error('Failed to play remote video:', error);
    }
  }

  // Toggle audio
  async toggleAudio() {
    try {
      if (this.localAudioTrack) {
        await this.localAudioTrack.setEnabled(!this.localAudioTrack.enabled);
        return this.localAudioTrack.enabled;
      }
      return false;
    } catch (error) {
      console.error('Failed to toggle audio:', error);
      return false;
    }
  }

  // Toggle video
  async toggleVideo() {
    try {
      if (this.localVideoTrack) {
        await this.localVideoTrack.setEnabled(!this.localVideoTrack.enabled);
        return this.localVideoTrack.enabled;
      }
      return false;
    } catch (error) {
      console.error('Failed to toggle video:', error);
      return false;
    }
  }

  // Event handlers
  handleUserPublished = async (user, mediaType) => {
    try {
      await this.client.subscribe(user, mediaType);
      
      if (mediaType === 'video') {
        this.remoteUsers[user.uid] = {
          ...this.remoteUsers[user.uid],
          videoTrack: user.videoTrack
        };
      }
      
      if (mediaType === 'audio') {
        this.remoteUsers[user.uid] = {
          ...this.remoteUsers[user.uid],
          audioTrack: user.audioTrack
        };
        user.audioTrack?.play();
      }

      // Notify parent component
      if (this.onRemoteUserPublished) {
        this.onRemoteUserPublished(user, mediaType);
      }

    } catch (error) {
      console.error('Failed to handle user published:', error);
    }
  };

  handleUserUnpublished = (user, mediaType) => {
    try {
      if (mediaType === 'video') {
        if (this.remoteUsers[user.uid]) {
          this.remoteUsers[user.uid].videoTrack = null;
        }
      }
      
      if (mediaType === 'audio') {
        if (this.remoteUsers[user.uid]) {
          this.remoteUsers[user.uid].audioTrack = null;
        }
      }

      // Notify parent component
      if (this.onRemoteUserUnpublished) {
        this.onRemoteUserUnpublished(user, mediaType);
      }

    } catch (error) {
      console.error('Failed to handle user unpublished:', error);
    }
  };

  handleUserJoined = (user) => {
    try {
      this.remoteUsers[user.uid] = {
        uid: user.uid,
        videoTrack: null,
        audioTrack: null
      };

      // Notify parent component
      if (this.onRemoteUserJoined) {
        this.onRemoteUserJoined(user);
      }

    } catch (error) {
      console.error('Failed to handle user joined:', error);
    }
  };

  handleUserLeft = (user) => {
    try {
      delete this.remoteUsers[user.uid];

      // Notify parent component
      if (this.onRemoteUserLeft) {
        this.onRemoteUserLeft(user);
      }

    } catch (error) {
      console.error('Failed to handle user left:', error);
    }
  };

  // Get remote users
  getRemoteUsers() {
    return Object.values(this.remoteUsers);
  }

  // Check if audio is enabled
  isAudioEnabled() {
    return this.localAudioTrack ? this.localAudioTrack.enabled : false;
  }

  // Check if video is enabled
  isVideoEnabled() {
    return this.localVideoTrack ? this.localVideoTrack.enabled : false;
  }

  // Get call statistics
  async getCallStats() {
    try {
      if (this.client) {
        return await this.client.getRemoteNetworkQuality();
      }
      return null;
    } catch (error) {
      console.error('Failed to get call stats:', error);
      return null;
    }
  }

  // Set event handlers
  setEventHandlers({
    onRemoteUserJoined,
    onRemoteUserLeft,
    onRemoteUserPublished,
    onRemoteUserUnpublished
  }) {
    this.onRemoteUserJoined = onRemoteUserJoined;
    this.onRemoteUserLeft = onRemoteUserLeft;
    this.onRemoteUserPublished = onRemoteUserPublished;
    this.onRemoteUserUnpublished = onRemoteUserUnpublished;
  }
}

// Export a single instance
export const agoraVideoCall = new AgoraVideoCall();

// Export the class for creating new instances if needed
export default AgoraVideoCall;
