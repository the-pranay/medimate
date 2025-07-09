'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  User, 
  Stethoscope, 
  Shield, 
  ArrowRight, 
  CheckCircle,
  Calendar,
  MessageCircle,
  FileText,
  Heart,
  Users,
  Video,
  Clock,
  Star
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function DemoPage() {
  const [selectedDemo, setSelectedDemo] = useState('overview');
  const router = useRouter();

  const handleDemoSelection = (demoType) => {
    setSelectedDemo(demoType);
    if (demoType === 'overview') {
      // Scroll to video section
      setTimeout(() => {
        const videoSection = document.getElementById('video-section');
        if (videoSection) {
          videoSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleUserTypeRedirect = (userType) => {
    if (userType === 'patient') {
      router.push('/register?role=patient');
    } else if (userType === 'doctor') {
      router.push('/register?role=doctor');
    }
  };

  const features = [
    {
      icon: Calendar,
      title: "Smart Appointment Booking",
      description: "Book appointments with specialists instantly using our AI-powered scheduling system.",
      demo: "Try booking an appointment with our demo doctor account"
    },
    {
      icon: MessageCircle,
      title: "Telemedicine & Chat",
      description: "Connect with healthcare providers through secure video calls and messaging.",
      demo: "Experience real-time messaging with healthcare providers"
    },
    {
      icon: FileText,
      title: "Digital Health Records",
      description: "Securely store and manage your complete medical history in one place.",
      demo: "Explore our HIPAA-compliant health records system"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Bank-level encryption ensures your medical data is always protected.",
      demo: "See our advanced security features in action"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
              <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">MediMate Demo</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Experience <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">MediMate</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Take a guided tour of our healthcare platform or try it yourself with our demo accounts. 
              No registration required!
            </p>
            
            {/* Demo Options */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Platform Overview</h3>
                <p className="text-gray-600 mb-4">Watch a quick overview of MediMate's key features</p>
                <Button 
                  onClick={() => handleDemoSelection('overview')}
                  className={`w-full ${selectedDemo === 'overview' ? 'bg-blue-600' : 'bg-gray-200 text-gray-700'}`}
                >
                  Watch Overview
                </Button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Patient Experience</h3>
                <p className="text-gray-600 mb-4">Register as a patient to access all healthcare features</p>
                <Button 
                  onClick={() => handleUserTypeRedirect('patient')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Register as Patient
                </Button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Doctor Experience</h3>
                <p className="text-gray-600 mb-4">Register as a healthcare provider to manage patients</p>
                <Button 
                  onClick={() => handleUserTypeRedirect('doctor')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Register as Doctor
                </Button>
              </div>
            </div>
          </div>

          {/* Demo Content */}
          {selectedDemo === 'overview' && (
            <div id="video-section" className="bg-white rounded-3xl shadow-xl p-8 mb-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Platform Overview</h2>
              
              {/* Video Placeholder */}
              <div className="bg-gray-900 rounded-2xl aspect-video flex items-center justify-center mb-8 relative overflow-hidden">
                <div className="text-center text-white">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-70" />
                  <h3 className="text-xl font-semibold mb-2">Interactive Demo Video</h3>
                  <p className="text-gray-300 mb-4">See MediMate in action with our guided walkthrough</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Play className="w-5 h-5 mr-2" />
                    Play Demo (Coming Soon)
                  </Button>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="absolute top-4 left-10 w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="absolute top-4 left-16 w-3 h-3 bg-green-500 rounded-full"></div>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{feature.description}</p>
                      <p className="text-blue-600 text-sm font-medium">{feature.demo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Why Choose MediMate?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Time</h3>
                <p className="text-gray-600">Reduce waiting times by 80% with smart scheduling</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-gray-600">HIPAA-compliant security for all your medical data</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Care</h3>
                <p className="text-gray-600">Connect with 2,500+ qualified healthcare professionals</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Experience the future of healthcare with MediMate
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="xl" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="xl">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
