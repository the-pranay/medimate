"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { 
  Calendar, 
  Users, 
  FileText, 
  Shield, 
  Clock, 
  Star,
  Heart,
  Stethoscope,
  Activity,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Award,
  TrendingUp,
  Plus,
  Play,
  ChevronRight,
  UserCheck,
  ClipboardCheck,
  Pill,
  Monitor,
  Headphones,
  Video,
  MessageCircle,
  Microscope,
  Zap,
  Globe
} from "lucide-react";
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import FloatingActionButton from '../ui/FloatingActionButton';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    successRate: 0,
    totalAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/homepage/stats');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setStats(data.data);
        } else {
          console.error('Invalid data received from stats API');
        }
      } else {
        console.error('Failed to fetch stats:', response.status);
      }
    } catch (error) {
      console.error('Error fetching homepage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden relative">
      {/* Medical Background */}
      <div className="absolute inset-0">
        {/* Clean Medical Grid */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50">
          {/* Subtle Medical Pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(139, 69, 19, 0.03) 0%, transparent 50%),
              linear-gradient(90deg, transparent 49%, rgba(59, 130, 246, 0.1) 50%, transparent 51%),
              linear-gradient(0deg, transparent 49%, rgba(16, 185, 129, 0.1) 50%, transparent 51%)
            `,
            backgroundSize: '100px 100px, 150px 150px, 200px 200px, 50px 50px, 50px 50px'
          }}></div>
          
          {/* Floating Medical Elements */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatParticle ${4 + Math.random() * 6}s ease-in-out infinite`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Hero Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                Transform Healthcare
              </span>
              <span className="block text-gray-800">
                With Digital Innovation
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience the future of healthcare with our advanced platform. 
              Connect with doctors, manage appointments, and access your medical records seamlessly.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/register?role=patient">
                <button className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <span className="relative flex items-center justify-center space-x-3">
                    <Users className="w-6 h-6" />
                    <span>Start as Patient</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
              
              <Link href="/register?role=doctor">
                <button className="group relative bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-8 rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  <span className="relative flex items-center justify-center space-x-3">
                    <Stethoscope className="w-6 h-6" />
                    <span>Join as Doctor</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                value: loading ? "..." : `${formatNumber(stats?.totalPatients || 0)}+`, 
                label: "Happy Patients", 
                icon: Users, 
                description: "Trusted by thousands",
                realValue: stats?.totalPatients || 0
              },
              { 
                value: loading ? "..." : `${stats?.successRate || 0}%`, 
                label: "Success Rate", 
                icon: CheckCircle, 
                description: "Proven results",
                realValue: stats?.successRate || 0
              },
              { 
                value: loading ? "..." : `${formatNumber(stats?.totalDoctors || 0)}+`, 
                label: "Expert Doctors", 
                icon: Stethoscope, 
                description: "Qualified professionals",
                realValue: stats?.totalDoctors || 0
              },
              { 
                value: loading ? "..." : `${formatNumber(stats?.totalAppointments || 0)}+`, 
                label: "Appointments", 
                icon: Calendar, 
                description: "Successful consultations",
                realValue: stats?.totalAppointments || 0
              }
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-400 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-500 hover:scale-105">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="text-2xl lg:text-3xl font-black text-blue-700 mb-2">
                    {stat.value}
                  </div>
                  
                  <div className="text-gray-700 font-semibold text-sm mb-1">
                    {stat.label}
                  </div>
                  
                  <div className="text-gray-500 text-xs">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative z-10 py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
              Our Medical Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare solutions powered by cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Online Appointments",
                description: "Schedule appointments with qualified doctors at your convenience",
                color: "blue"
              },
              {
                icon: Video,
                title: "Telemedicine",
                description: "Connect with healthcare providers through secure video consultations",
                color: "green"
              },
              {
                icon: FileText,
                title: "Digital Records",
                description: "Access and manage your medical records securely in one place",
                color: "purple"
              },
              {
                icon: Pill,
                title: "Prescription Management",
                description: "Digital prescriptions with pharmacy integration and refill reminders",
                color: "pink"
              },
              {
                icon: Activity,
                title: "Health Monitoring",
                description: "Track your health metrics and receive personalized insights",
                color: "orange"
              },
              {
                icon: MessageCircle,
                title: "24/7 Support",
                description: "Round-the-clock medical support and emergency assistance",
                color: "teal"
              }
            ].map((service, index) => (
              <div key={index} className="group">
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200 hover:border-blue-300 rounded-2xl p-8 hover:shadow-lg transition-all duration-500 hover:scale-105">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <service.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to access quality healthcare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Sign Up",
                description: "Create your account and complete your medical profile",
                icon: UserCheck
              },
              {
                step: "02",
                title: "Book Appointment",
                description: "Choose your preferred doctor and schedule your appointment",
                icon: Calendar
              },
              {
                step: "03",
                title: "Get Care",
                description: "Receive quality healthcare through our secure platform",
                icon: Heart
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{step.step}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            
            <p className="text-xl mb-8 opacity-90">
              Join thousands of patients who trust MediMate for their healthcare needs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <button className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105">
                  Get Started Free
                </button>
              </Link>
              
              <Link href="/demo">
                <button className="border-2 border-white/30 hover:border-white text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105">
                  Watch Demo
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      
      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
