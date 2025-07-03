'use client';

import { useState, useEffect } from 'react';
import { Heart, Activity } from 'lucide-react';

export default function HeartbeatMonitor() {
  const [heartRate, setHeartRate] = useState(72);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setHeartRate(prev => 70 + Math.floor(Math.random() * 10));
      setTimeout(() => setIsPulsing(false), 200);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200">
      <div className="flex items-center justify-center space-x-4 mb-4">
        <Heart 
          className={`w-8 h-8 text-red-500 transition-transform duration-200 ${
            isPulsing ? 'scale-125' : 'scale-100'
          }`}
        />
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{heartRate}</div>
          <div className="text-sm text-red-500">BPM</div>
        </div>
      </div>
      
      <div className="h-16 bg-black rounded-lg p-2 mb-4">
        <div className="h-full flex items-center justify-center">
          <Activity className="w-full h-8 text-green-400" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm font-semibold text-slate-700">98.6°F</div>
          <div className="text-xs text-slate-500">Temperature</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-700">120/80</div>
          <div className="text-xs text-slate-500">Blood Pressure</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-700">98%</div>
          <div className="text-xs text-slate-500">Oxygen</div>
        </div>
      </div>
    </div>
  );
}
