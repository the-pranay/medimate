'use client';

import { useEffect, useState } from 'react';
import { checkAgoraConfig } from '../../lib/envValidator';

export default function EnvTest() {
  const [agoraConfig, setAgoraConfig] = useState(null);
  const [envVars, setEnvVars] = useState({});

  useEffect(() => {
    // Test environment variables
    const testEnvVars = {
      agoraAppId: process.env.NEXT_PUBLIC_AGORA_APP_ID,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      nodeEnv: process.env.NODE_ENV
    };

    setEnvVars(testEnvVars);

    // Test Agora configuration
    const config = checkAgoraConfig();
    setAgoraConfig(config);

    console.log('🧪 Environment Test Results:', {
      envVars: testEnvVars,
      agoraConfig: config
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Environment Variables Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Environment Variables</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">NODE_ENV:</span>
                <span className="ml-2 text-gray-600">{envVars.nodeEnv || 'Not set'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">NEXT_PUBLIC_AGORA_APP_ID:</span>
                <span className="ml-2 text-gray-600">
                  {envVars.agoraAppId ? 
                    `${envVars.agoraAppId.substring(0, 8)}...` : 
                    'Not set'
                  }
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">NEXT_PUBLIC_RAZORPAY_KEY_ID:</span>
                <span className="ml-2 text-gray-600">
                  {envVars.razorpayKeyId ? 
                    `${envVars.razorpayKeyId.substring(0, 8)}...` : 
                    'Not set'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Agora Configuration</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  agoraConfig?.isValid 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {agoraConfig?.isValid ? 'Valid' : 'Invalid'}
                </span>
              </div>
              {agoraConfig?.error && (
                <div>
                  <span className="font-medium text-gray-700">Error:</span>
                  <p className="ml-2 text-red-600 text-sm">{agoraConfig.error}</p>
                </div>
              )}
              {agoraConfig?.suggestion && (
                <div>
                  <span className="font-medium text-gray-700">Suggestion:</span>
                  <p className="ml-2 text-blue-600 text-sm">{agoraConfig.suggestion}</p>
                </div>
              )}
              {agoraConfig?.appId && (
                <div>
                  <span className="font-medium text-gray-700">App ID:</span>
                  <span className="ml-2 text-gray-600">
                    {agoraConfig.appId.substring(0, 8)}...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Console Output</h2>
          <p className="text-gray-600 text-sm">
            Check the browser console for detailed logging output. Open Developer Tools (F12) 
            and check the Console tab for environment variable tests.
          </p>
        </div>
      </div>
    </div>
  );
}
