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
  Shield,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '../ui/Button';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            
            <Link href="/services" className="nav-link group flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-gray-700 hover:text-blue-600 font-medium transition-colors group-hover:text-blue-600">Services</span>
            </Link>
            
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
            
            <Link href="/services" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50 transition-colors">
              <Users className="w-5 h-5 text-green-500" />
              <span className="font-medium text-gray-700">Services</span>
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
