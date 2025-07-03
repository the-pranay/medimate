'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getTheme } from '../../../lib/themes';

export default function ThemedDashboard({ children, role }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const userRole = user?.role || role || 'patient';
    setTheme(getTheme(userRole));
  }, [user, role]);

  if (!theme) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br ${theme.gradient}`}
      style={{
        '--theme-primary': theme.primary,
        '--theme-secondary': theme.secondary,
        '--theme-accent': theme.accent,
      }}
    >
      {children}
    </div>
  );
}
