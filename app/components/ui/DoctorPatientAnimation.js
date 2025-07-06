'use client';

import { useState, useEffect } from 'react';
import { Video, User, MessageCircle, Phone, PhoneOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorPatientAnimation() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
    }, 1000);

    const messageTimer = setTimeout(() => {
      setMessages([
        { sender: 'doctor', text: 'Hello, how are you feeling today?' },
        { sender: 'patient', text: 'Much better, thank you!' }
      ]);
    }, 3000);

    return () => {
      clearTimeout(connectTimer);
      clearTimeout(messageTimer);
    };
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Video className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              // Start call functionality
              toast.info('Start call functionality - Coming soon!');
            }}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              // End call functionality
              toast.info('End call functionality - Coming soon!');
            }}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Dr. Smith</span>
          </div>
          <div className="w-full h-24 bg-blue-100 rounded-lg flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full border-4 ${isConnected ? 'border-green-400' : 'border-gray-300'} flex items-center justify-center`}>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-teal-200">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Patient</span>
          </div>
          <div className="w-full h-24 bg-teal-100 rounded-lg flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full border-4 ${isConnected ? 'border-green-400' : 'border-gray-300'} flex items-center justify-center`}>
              <User className="w-8 h-8 text-teal-600" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'doctor' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-xs p-2 rounded-lg text-sm ${
              message.sender === 'doctor' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-teal-100 text-teal-800'
            }`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        <MessageCircle className="w-4 h-4 text-gray-400" />
        <div className="text-xs text-gray-500">
          {isConnected ? 'Video consultation in progress' : 'Establishing connection...'}
        </div>
      </div>
    </div>
  );
}
