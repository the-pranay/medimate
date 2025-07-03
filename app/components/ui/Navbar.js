"use client";

import Link from 'next/link';
import { useState } from 'react';
import { 
  Menu, 
  X, 
  Heart, 
  Stethoscope, 
  Calendar, 
  Users, 
  ChevronDown,
  Shield,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '../ui/Button';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Medical Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              {/* Medical Logo with Heartbeat */}
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-green-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                  <div className="relative">
                    <Heart className="w-7 h-7 text-white animate-heartbeat" />
                    <Stethoscope className="w-6 h-6 text-white/90 absolute top-0.5 left-0.5" />
                  </div>
                </div>
                {/* Medical pulse rings */}
                <div className="absolute inset-0 w-14 h-14 bg-blue-400/20 rounded-2xl animate-ping"></div>
                <div className="absolute inset-0 w-14 h-14 bg-green-400/10 rounded-2xl animate-ping delay-75"></div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent">
                  MediMate
                </span>
                <span className="text-xs text-gray-600 font-semibold tracking-wider uppercase">
                  Healthcare Excellence
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/features" className="nav-link group flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700 hover:text-blue-600 font-medium transition-colors group-hover:text-blue-600">Features</span>
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative group">
              <button 
                className="nav-link flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <Users className="w-4 h-4 text-green-600" />
                <span>Services</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              
              {/* Enhanced Dropdown Menu */}
              <div 
                className={`absolute top-full left-0 mt-3 w-80 bg-white/95 backdrop-blur-lg border border-blue-100 rounded-2xl shadow-xl transition-all duration-300 ${
                  isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
                }`}
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <div className="p-6 space-y-4">
                  <Link href="/book-appointment" className="flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50/80 transition-colors group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Book Appointment</div>
                      <div className="text-sm text-gray-600">Schedule with specialists</div>
                    </div>
                  </Link>
                  
                  <Link href="/my-reports" className="flex items-center space-x-4 p-4 rounded-xl hover:bg-green-50/80 transition-colors group">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Health Records</div>
                      <div className="text-sm text-gray-600">Secure medical data</div>
                    </div>
                  </Link>
                  
                  <Link href="/messages" className="flex items-center space-x-4 p-4 rounded-xl hover:bg-purple-50/80 transition-colors group">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Telemedicine</div>
                      <div className="text-sm text-gray-600">Virtual consultations</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            
            <Link href="/about" className="nav-link group flex items-center space-x-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-gray-700 hover:text-blue-600 font-medium transition-colors group-hover:text-blue-600">About</span>
            </Link>
            
            <Link href="/contact" className="nav-link group flex items-center space-x-2">
              <Phone className="w-4 h-4 text-green-600" />
              <span className="text-gray-700 hover:text-blue-600 font-medium transition-colors group-hover:text-blue-600">Contact</span>
            </Link>
          </div>
          
          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" size="md" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="md" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                Get Started Free
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-blue-600" />
              ) : (
                <Menu className="w-6 h-6 text-blue-600" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="py-6 space-y-4">
            <Link href="/features" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 transition-colors">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-gray-700">Features</span>
            </Link>
            
            <Link href="/book-appointment" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50 transition-colors">
              <Calendar className="w-5 h-5 text-green-500" />
              <span className="font-medium text-gray-700">Book Appointment</span>
            </Link>
            
            <Link href="/my-reports" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 transition-colors">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-gray-700">Health Records</span>
            </Link>
            
            <Link href="/about" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-pink-50 transition-colors">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-medium text-gray-700">About</span>
            </Link>
            
            <Link href="/contact" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50 transition-colors">
              <Phone className="w-5 h-5 text-green-500" />
              <span className="font-medium text-gray-700">Contact</span>
            </Link>
            
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <Link href="/login" className="block">
                <Button variant="ghost" size="md" className="w-full justify-center text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="block">
                <Button variant="primary" size="md" className="w-full justify-center bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
