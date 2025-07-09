"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, MessageCircle, FileText, X, Plus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and get role
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  const handleActionClick = (href, label) => {
    if (!isAuthenticated) {
      toast.error(`Please login to access ${label}`, {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#f87171',
          color: 'white',
          fontWeight: 'bold',
        },
      });
      setTimeout(() => {
        router.push('/login');
      }, 1000);
      return;
    }
    router.push(href);
  };

  const getActionsForRole = () => {
    const baseActions = [
      {
        icon: Calendar,
        label: 'Book Appointment',
        href: '/book-appointment',
        color: 'from-blue-500 to-blue-600',
        hoverColor: 'hover:from-blue-600 hover:to-blue-700'
      }
    ];

    if (userRole === 'patient') {
      return [
        ...baseActions,
        {
          icon: MessageCircle,
          label: 'Messages',
          href: '/patient/messages',
          color: 'from-emerald-500 to-teal-600',
          hoverColor: 'hover:from-emerald-600 hover:to-teal-700'
        },
        {
          icon: FileText,
          label: 'Health Records',
          href: '/patient/reports',
          color: 'from-purple-500 to-indigo-600',
          hoverColor: 'hover:from-purple-600 hover:to-indigo-700'
        }
      ];
    } else if (userRole === 'doctor') {
      return [
        {
          icon: Calendar,
          label: 'Appointments',
          href: '/doctor/appointments',
          color: 'from-blue-500 to-blue-600',
          hoverColor: 'hover:from-blue-600 hover:to-blue-700'
        },
        {
          icon: MessageCircle,
          label: 'Messages',
          href: '/doctor/messages',
          color: 'from-emerald-500 to-teal-600',
          hoverColor: 'hover:from-emerald-600 hover:to-teal-700'
        },
        {
          icon: FileText,
          label: 'Patient Records',
          href: '/doctor/patients',
          color: 'from-purple-500 to-indigo-600',
          hoverColor: 'hover:from-purple-600 hover:to-indigo-700'
        }
      ];
    }

    // Default actions for non-authenticated or unknown roles
    return baseActions;
  };

  const actions = getActionsForRole();

  const handleMainFabClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to access healthcare services', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#f87171',
          color: 'white',
          fontWeight: 'bold',
        },
      });
      setTimeout(() => {
        router.push('/login');
      }, 1000);
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Toaster />
      <div className="fixed bottom-8 right-8 z-50">
        {/* Action buttons */}
        <div className={`flex flex-col-reverse space-y-reverse space-y-3 mb-4 transition-all duration-300 ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'
        }`}>
          {actions.map((action, index) => (
            <div key={index} className="group flex items-center">
              <span className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {action.label}
              </span>
              <button 
                onClick={() => handleActionClick(action.href, action.label)}
                className={`w-12 h-12 bg-gradient-to-r ${action.color} ${action.hoverColor} rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110`}
              >
                <action.icon className="w-6 h-6 text-white" />
              </button>
            </div>
          ))}
        </div>

        {/* Main FAB */}
        <button
          onClick={handleMainFabClick}
          className={`w-16 h-16 bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 hover:from-blue-700 hover:via-teal-700 hover:to-emerald-700 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse-medical ${
            isOpen ? 'rotate-45' : ''
          }`}
          title={!isAuthenticated ? 'Login to access services' : 'Quick Actions'}
        >
          {isOpen ? (
            <X className="w-8 h-8 text-white" />
          ) : (
            <Plus className="w-8 h-8 text-white" />
          )}
        </button>
      </div>
    </>
  );
}
