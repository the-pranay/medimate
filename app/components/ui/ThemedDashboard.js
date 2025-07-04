'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getTheme } from '../../../lib/themes';

export default function ThemedDashboard({ children, role }) {
  const authContext = useAuth();
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    try {
      // Get role from multiple sources for robustness
      const userRole = authContext?.user?.role || role || 'patient';
      console.log('🎨 ThemedDashboard: Setting theme for role:', userRole);
      
      const selectedTheme = getTheme(userRole);
      console.log('🎨 ThemedDashboard: Theme selected:', selectedTheme);
      
      setTheme(selectedTheme);
    } catch (error) {
      console.error('🎨 ThemedDashboard: Error setting theme:', error);
      // Fallback to default theme
      setTheme(getTheme('patient'));
    }
  }, [authContext?.user, role]);

  // Always render something, even if theme is not ready
  const themeToUse = theme || getTheme('patient');
  
  console.log('🎨 ThemedDashboard: Rendering with theme:', themeToUse?.name);

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br ${themeToUse.gradient}`}
      style={{
        '--theme-primary': themeToUse.primary,
        '--theme-secondary': themeToUse.secondary,
        '--theme-accent': themeToUse.accent,
      }}
    >
      {children}
    </div>
  );
}
