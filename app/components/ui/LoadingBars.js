'use client';

import React from 'react';
import { Heart, Stethoscope, Activity, Pulse } from 'lucide-react';

// Heartbeat Loader Component
export const HeartbeatLoader = ({ 
  size = 'md', 
  color = 'blue',
  showText = true,
  text = 'Loading...',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    red: 'text-red-500',
    green: 'text-green-500',
    purple: 'text-purple-600',
    pink: 'text-pink-500'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Heartbeat Animation */}
      <div className="relative">
        <div className="flex items-center space-x-1">
          {/* EKG Line */}
          <div className="flex items-center">
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <svg 
              className={`${sizeClasses[size]} ${colorClasses[color]} animate-pulse`}
              viewBox="0 0 100 20" 
              fill="none"
            >
              <path 
                d="M0 10 L20 10 L25 5 L30 15 L35 5 L40 15 L45 10 L100 10" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none"
                className="animate-heartbeat"
              />
            </svg>
            <div className="w-8 h-0.5 bg-gray-300"></div>
          </div>
        </div>
        
        {/* Pulsing Heart */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <Heart 
            className={`${sizeClasses[size]} ${colorClasses[color]} animate-heartbeat fill-current`}
          />
        </div>
      </div>

      {/* Loading Text */}
      {showText && (
        <div className="text-center">
          <p className={`text-sm font-medium ${colorClasses[color]} animate-pulse`}>
            {text}
          </p>
        </div>
      )}
    </div>
  );
};

// Medical Pulse Loader
export const MedicalPulseLoader = ({ 
  size = 'md', 
  color = 'blue',
  showText = true,
  text = 'Processing...',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    red: 'text-red-500',
    green: 'text-green-500',
    purple: 'text-purple-600',
    pink: 'text-pink-500'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <Activity className={`${sizeClasses[size]} ${colorClasses[color]} animate-bounce`} />
        <Stethoscope className={`${sizeClasses[size]} ${colorClasses[color]} animate-pulse`} />
        <Heart className={`${sizeClasses[size]} ${colorClasses[color]} animate-bounce fill-current`} />
      </div>
      
      {showText && (
        <p className={`text-sm font-medium ${colorClasses[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Stethoscope Loader
export const StethoscopeLoader = ({ 
  size = 'md',
  color = 'blue', 
  showText = true,
  text = 'Connecting...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    red: 'text-red-500', 
    green: 'text-green-500',
    purple: 'text-purple-600',
    pink: 'text-pink-500'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        <Stethoscope 
          className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin-slow`}
        />
        <div className={`absolute inset-0 ${sizeClasses[size]} ${colorClasses[color]} animate-ping opacity-20 rounded-full bg-current`}></div>
      </div>
      
      {showText && (
        <p className={`text-sm font-medium ${colorClasses[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Dots Loader for Medical Theme
export const MedicalDotsLoader = ({ 
  size = 'md',
  color = 'blue',
  showText = true, 
  text = 'Please wait...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4', 
    xl: 'w-6 h-6'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    red: 'bg-red-500',
    green: 'bg-green-500', 
    purple: 'bg-purple-600',
    pink: 'bg-pink-500'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
            style={{
              animationDelay: `${index * 0.2}s`,
              animationDuration: '1.4s'
            }}
          ></div>
        ))}
      </div>
      
      {showText && (
        <p className={`text-sm font-medium text-gray-600 animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Spinner Loader with Medical Cross
export const MedicalSpinnerLoader = ({ 
  size = 'md',
  color = 'blue',
  showText = true,
  text = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    red: 'border-red-500',
    green: 'border-green-500',
    purple: 'border-purple-600', 
    pink: 'border-pink-500'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} ${colorClasses[color]} border-4 border-t-transparent rounded-full animate-spin`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-2 h-2 bg-current ${colorClasses[color].replace('border-', 'text-')} rounded-full`}></div>
        </div>
      </div>
      
      {showText && (
        <p className={`text-sm font-medium text-gray-600 animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Page Loader Component
export const PageLoader = ({ 
  type = 'heartbeat',
  size = 'lg',
  color = 'blue',
  text = 'Loading MediMate...',
  fullScreen = true 
}) => {
  const LoaderComponent = {
    heartbeat: HeartbeatLoader,
    pulse: MedicalPulseLoader,
    stethoscope: StethoscopeLoader,
    dots: MedicalDotsLoader,
    spinner: MedicalSpinnerLoader
  }[type] || HeartbeatLoader;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <LoaderComponent 
            size={size}
            color={color}
            text={text}
            showText={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <LoaderComponent 
        size={size}
        color={color}
        text={text}
        showText={true}
      />
    </div>
  );
};

// Default Export - Heartbeat Loader
export default HeartbeatLoader;
