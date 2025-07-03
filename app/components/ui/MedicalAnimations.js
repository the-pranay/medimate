"use client";

import { useEffect, useRef } from 'react';
import { Heart, Activity, Stethoscope } from 'lucide-react';

export function HeartbeatMonitor() {
  return (
    <div className="relative w-full h-20 glass-card p-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Heart className="w-6 h-6 text-red-500 animate-heartbeat" />
          <span className="text-sm font-semibold text-slate-700">Heart Rate</span>
        </div>
        <span className="text-lg font-bold text-blue-600">72 BPM</span>
      </div>
      
      {/* EKG Line */}
      <div className="ekg-container mt-2">
        <div className="ekg-line"></div>
      </div>
    </div>
  );
}

export function Rotating3DOrgan() {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center animate-rotate-3d shadow-lg">
        <Stethoscope className="w-12 h-12 text-white" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-teal-400/30 rounded-full animate-pulse"></div>
    </div>
  );
}

export function MedicalFloatingIcons() {
  const icons = [
    { Icon: Heart, color: 'text-red-500', delay: '0s' },
    { Icon: Activity, color: 'text-green-500', delay: '1s' },
    { Icon: Stethoscope, color: 'text-blue-500', delay: '2s' }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {icons.map(({ Icon, color, delay }, index) => (
        <div
          key={index}
          className="absolute animate-float-medical"
          style={{
            top: `${20 + index * 25}%`,
            left: `${10 + index * 30}%`,
            animationDelay: delay
          }}
        >
          <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center">
            <Icon className={`w-8 h-8 ${color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DoctorPatientAnimation() {
  return (
    <div className="relative w-full h-32 glass-card p-6 overflow-hidden">
      <div className="flex items-center justify-between">
        {/* Doctor */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse-medical">
            <span className="text-2xl">👨‍⚕️</span>
          </div>
          <span className="text-xs font-medium text-slate-600">Doctor</span>
        </div>
        
        {/* Connection Animation */}
        <div className="flex-1 px-4">
          <div className="relative h-2 bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 rounded-full animate-gradient">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-blue-500 animate-ping"></div>
          </div>
        </div>
        
        {/* Patient */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center animate-pulse-medical delay-75">
            <span className="text-2xl">👤</span>
          </div>
          <span className="text-xs font-medium text-slate-600">Patient</span>
        </div>
      </div>
    </div>
  );
}

export function PulseAnimation() {
  return (
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full animate-ping opacity-75"></div>
      <div className="absolute inset-2 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full animate-pulse"></div>
      <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
        <Activity className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  );
}

export default function MedicalAnimations() {
  return {
    HeartbeatMonitor,
    Rotating3DOrgan,
    MedicalFloatingIcons,
    DoctorPatientAnimation,
    PulseAnimation
  };
}
