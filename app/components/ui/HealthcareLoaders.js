'use client';

import React from 'react';
import { Heart, Stethoscope, Activity, Pulse, Heartbeat, Plus, UserRound, Calendar, ClipboardCheck } from 'lucide-react';

/**
 * Heartbeat ECG Loader Component
 * A medical-themed loader showing an ECG line with a beating heart animation
 */
export const HeartbeatLoader = ({ 
  size = 'md', 
  color = 'primary',
  showText = true,
  text = 'Loading...',
  className = '' 
}) => {
  // Size configurations
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  // Color configurations for healthcare theme
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-teal-500',
    accent: 'text-indigo-600',
    danger: 'text-red-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
    info: 'text-cyan-500',
    dark: 'text-gray-800'
  };
  
  // EKG line paths for different rhythm patterns
  const ekgPaths = {
    normal: "M0 10 L10 10 L15 0 L20 20 L25 0 L30 10 L35 10 L40 10 L45 0 L50 20 L55 10 L100 10",
    critical: "M0 10 L5 10 L10 0 L15 20 L20 0 L25 20 L30 0 L35 20 L40 10 L45 10 L50 5 L55 15 L60 10 L100 10",
    flatline: "M0 10 L20 10 L25 0 L30 20 L35 10 L100 10"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Heartbeat Animation Container */}
      <div className="relative">
        <div className="flex items-center">
          {/* EKG Line */}
          <div className="flex items-center">
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <svg 
              className={`${sizeClasses[size]} ${colorClasses[color]}`}
              viewBox="0 0 100 20" 
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d={ekgPaths.normal}
                stroke="currentColor" 
                strokeWidth="2.5"
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="animate-pulse-wave"
              />
            </svg>
            <div className="w-8 h-0.5 bg-gray-200"></div>
          </div>
        </div>
        
        {/* Pulsing Heart */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
          <Heart 
            className={`${sizeClasses[size]} ${colorClasses[color]} animate-heartbeat fill-current`}
          />
        </div>
      </div>

      {/* Loading Text */}
      {showText && (
        <div className="mt-3 text-center">
          <p className={`text-sm font-medium ${colorClasses[color]}`}>
            {text}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Medical Dashboard Loader
 * Shows multiple medical icons with synchronized animations
 */
export const MedicalDashboardLoader = ({ 
  size = 'md', 
  color = 'primary',
  showText = true,
  text = 'Loading your dashboard...',
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-7 h-7', 
    lg: 'w-9 h-9',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-teal-500',
    accent: 'text-indigo-600',
    danger: 'text-red-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
    info: 'text-cyan-500',
    dark: 'text-gray-800'
  };
  
  const containerSizeClasses = {
    xs: 'w-16',
    sm: 'w-24',
    md: 'w-32',
    lg: 'w-40',
    xl: 'w-48'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className={`relative flex items-center justify-between ${containerSizeClasses[size]}`}>
        <Activity 
          className={`${sizeClasses[size]} ${colorClasses[color]} animate-medical-pulse`} 
          style={{ animationDelay: '0s' }}
        />
        <Stethoscope 
          className={`${sizeClasses[size]} ${colorClasses[color]} animate-medical-pulse`} 
          style={{ animationDelay: '0.3s' }}
        />
        <Heart 
          className={`${sizeClasses[size]} ${colorClasses[color]} animate-medical-pulse fill-current`} 
          style={{ animationDelay: '0.6s' }}
        />
        <UserRound 
          className={`${sizeClasses[size]} ${colorClasses[color]} animate-medical-pulse`} 
          style={{ animationDelay: '0.9s' }}
        />
      </div>
      
      {showText && (
        <p className={`text-sm font-medium ${colorClasses[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

/**
 * Stethoscope Loader
 * Shows a stethoscope with a pulsing effect for medical data loading
 */
export const StethoscopeLoader = ({ 
  size = 'md',
  color = 'primary', 
  showText = true,
  text = 'Fetching medical data...',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-teal-500',
    accent: 'text-indigo-600',
    danger: 'text-red-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
    info: 'text-cyan-500',
    dark: 'text-gray-800'
  };
  
  const ringClasses = {
    primary: 'ring-blue-400',
    secondary: 'ring-teal-400',
    accent: 'ring-indigo-400',
    danger: 'ring-red-400',
    success: 'ring-green-400',
    warning: 'ring-amber-400',
    info: 'ring-cyan-400',
    dark: 'ring-gray-400'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        {/* Rotating stethoscope */}
        <div className={`rounded-full p-3 ${ringClasses[color]} ring-1 ring-opacity-50`}>
          <Stethoscope 
            className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin-slow`}
          />
        </div>
        
        {/* Pulse effect around stethoscope */}
        <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${colorClasses[color]}`}></div>
      </div>
      
      {showText && (
        <p className={`text-sm font-medium ${colorClasses[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

/**
 * Medical Appointment Loader
 * Calendar-themed loader for appointment scheduling and viewing
 */
export const AppointmentLoader = ({ 
  size = 'md',
  color = 'primary',
  showText = true, 
  text = 'Loading appointments...',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-teal-500',
    accent: 'text-indigo-600',
    danger: 'text-red-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
    info: 'text-cyan-500',
    dark: 'text-gray-800'
  };
  
  const bgClasses = {
    primary: 'bg-blue-100',
    secondary: 'bg-teal-100',
    accent: 'bg-indigo-100',
    danger: 'bg-red-100',
    success: 'bg-green-100',
    warning: 'bg-amber-100',
    info: 'bg-cyan-100',
    dark: 'bg-gray-100'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        <div className={`rounded-lg ${bgClasses[color]} p-2 animate-pulse`}>
          <Calendar className={`${sizeClasses[size]} ${colorClasses[color]}`} />
        </div>
        
        {/* Small dots representing appointments */}
        <div className="absolute top-1/4 right-1/4">
          <div className={`w-2 h-2 rounded-full ${colorClasses[color]} animate-ping opacity-75`}></div>
        </div>
        <div className="absolute bottom-1/4 left-1/4">
          <div className={`w-2 h-2 rounded-full ${colorClasses[color]} animate-ping opacity-75`} style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
      
      {showText && (
        <p className={`text-sm font-medium ${colorClasses[color]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

/**
 * Medical Report Loader
 * Clipboard-themed loader for medical reports and documents
 */
export const MedicalReportLoader = ({ 
  size = 'md',
  color = 'primary',
  showText = true,
  text = 'Loading medical reports...',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-teal-500',
    accent: 'text-indigo-600',
    danger: 'text-red-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
    info: 'text-cyan-500',
    dark: 'text-gray-800'
  };
  
  const bgClasses = {
    primary: 'bg-blue-50',
    secondary: 'bg-teal-50',
    accent: 'bg-indigo-50',
    danger: 'bg-red-50',
    success: 'bg-green-50',
    warning: 'bg-amber-50',
    info: 'bg-cyan-50',
    dark: 'bg-gray-50'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        <div className={`rounded-lg ${bgClasses[color]} p-3 shadow-sm`}>
          <ClipboardCheck className={`${sizeClasses[size]} ${colorClasses[color]} animate-pulse`} />
          
          {/* Line animations representing text on clipboard */}
          <div className="absolute inset-0 flex flex-col justify-center items-center pt-7">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className={`w-${i === 0 ? '2/3' : '1/2'} h-1 ${colorClasses[color]} opacity-40 rounded mb-1.5`}
                style={{ 
                  animation: 'medical-pulse 2s ease-in-out infinite',
                  animationDelay: `${i * 0.3}s` 
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {showText && (
        <p className={`text-sm font-medium ${colorClasses[color]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

/**
 * Medical Cross Spinner Loader
 * A spinner loader with a medical plus symbol
 */
export const MedicalSpinnerLoader = ({ 
  size = 'md',
  color = 'primary',
  showText = true,
  text = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const borderClasses = {
    primary: 'border-blue-600',
    secondary: 'border-teal-500',
    accent: 'border-indigo-600',
    danger: 'border-red-500',
    success: 'border-green-500',
    warning: 'border-amber-500',
    info: 'border-cyan-500',
    dark: 'border-gray-800'
  };

  const textClasses = {
    primary: 'text-blue-600',
    secondary: 'text-teal-500',
    accent: 'text-indigo-600',
    danger: 'text-red-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
    info: 'text-cyan-500',
    dark: 'text-gray-800'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        {/* Spinning border */}
        <div 
          className={`${sizeClasses[size]} ${borderClasses[color]} border-4 border-t-transparent rounded-full animate-spin`}
        ></div>
        
        {/* Medical cross in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Plus 
            className={`${parseInt(sizeClasses[size].split(' ')[0].replace('w-', '')) / 2.5}px ${textClasses[color]}`}
            strokeWidth={3}
          />
        </div>
      </div>
      
      {showText && (
        <p className={`text-sm font-medium ${textClasses[color]} mt-2`}>
          {text}
        </p>
      )}
    </div>
  );
};

/**
 * Page Loader Component
 * Full screen or contained loader with different medical themed options
 */
export const PageLoader = ({ 
  type = 'heartbeat',
  size = 'lg',
  color = 'primary',
  text = 'Loading MediMate...',
  fullScreen = true 
}) => {
  const LoaderComponent = {
    heartbeat: HeartbeatLoader,
    dashboard: MedicalDashboardLoader,
    stethoscope: StethoscopeLoader,
    appointment: AppointmentLoader,
    report: MedicalReportLoader,
    spinner: MedicalSpinnerLoader
  }[type] || HeartbeatLoader;

  // For component preloading
  const preloadAllLoaders = () => {
    return (
      <div className="hidden">
        <HeartbeatLoader size="xs" />
        <MedicalDashboardLoader size="xs" />
        <StethoscopeLoader size="xs" />
        <AppointmentLoader size="xs" />
        <MedicalReportLoader size="xs" />
        <MedicalSpinnerLoader size="xs" />
      </div>
    );
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <LoaderComponent 
            size={size}
            color={color}
            text={text}
            showText={true}
          />
        </div>
        {preloadAllLoaders()}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <LoaderComponent 
        size={size}
        color={color}
        text={text}
        showText={true}
      />
    </div>
  );
};

/**
 * Button Loader - Used inside buttons during form submissions
 */
export const ButtonLoader = ({ 
  color = 'white',
  size = 'sm'
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const colorClasses = {
    white: 'text-white',
    primary: 'text-blue-600',
    secondary: 'text-teal-500',
    dark: 'text-gray-800'
  };

  return (
    <div className="inline-flex items-center justify-center">
      <svg 
        className={`animate-spin -ml-1 mr-2 ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

// Default export for simpler imports
export default HeartbeatLoader;
