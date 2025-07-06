'use client';

import { useEffect, useState } from 'react';

export default function DebugAuth() {
  const [authData, setAuthData] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const userRole = localStorage.getItem('userRole');
      
      setAuthData({
        token: token ? token.substring(0, 20) + '...' : null,
        user: user ? JSON.parse(user) : null,
        userRole
      });
    }
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">LocalStorage Data:</h2>
        <pre className="text-sm bg-white p-4 rounded border overflow-auto">
          {JSON.stringify(authData, null, 2)}
        </pre>
      </div>
      
      <div className="mt-6">
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear LocalStorage
        </button>
      </div>
    </div>
  );
}
