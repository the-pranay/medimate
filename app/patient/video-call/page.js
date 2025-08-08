'use client';

import dynamic from 'next/dynamic';

// Dynamically import the video call component with SSR disabled
const VideoCallClient = dynamic(
  () => import('../../video-call/VideoCallClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading video calling service...</p>
        </div>
      </div>
    )
  }
);

export default function PatientVideoCall() {
  return <VideoCallClient />;
}
