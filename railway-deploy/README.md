# MediMate Socket.IO Server

Production Socket.IO server for MediMate real-time communication.

## Quick Deploy to Railway

1. This repository contains the Socket.IO server for MediMate
2. Railway will automatically detect and deploy this Node.js application
3. No configuration needed - just connect and deploy!

## What This Server Does

- ✅ Real-time messaging between doctors and patients
- ✅ Video call signaling (WebRTC)
- ✅ Typing indicators
- ✅ Connection status tracking
- ✅ Health monitoring

## After Deployment

Copy your Railway URL and update the MediMate main app environment variables:

```env
NEXT_PUBLIC_SOCKET_SERVER_URL=https://your-railway-url-here
```

## Test Your Deployment

Visit your Railway URL - you should see a JSON response confirming the server is running.
