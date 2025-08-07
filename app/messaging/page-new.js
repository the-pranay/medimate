'use client';

import dynamic from 'next/dynamic';

// Dynamically import the ImprovedMessaging component with SSR disabled
const ImprovedMessaging = dynamic(
  () => import('./ImprovedMessaging'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messaging service...</p>
        </div>
      </div>
    )
  }
);

export default function Messaging() {
  return <ImprovedMessaging />;
}
