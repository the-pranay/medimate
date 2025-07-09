'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Shield, 
  MessageCircle, 
  FileText, 
  Users, 
  Heart,
  Smartphone,
  Clock,
  Award,
  Globe,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export default function Features() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    activeDoctors: 0,
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
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  const features = [
    {
      icon: Calendar,
      title: "Smart Appointment Booking",
      description: "Book appointments with specialists instantly. AI-powered scheduling finds the best times for both you and your doctor.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Secure Health Records",
      description: "HIPAA-compliant digital health records accessible anytime, anywhere. Your medical history is always at your fingertips.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: MessageCircle,
      title: "Telemedicine & Chat",
      description: "Connect with healthcare providers through secure video calls and messaging. Get medical advice from home.",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: FileText,
      title: "Digital Prescriptions",
      description: "Receive and manage digital prescriptions. Track medication schedules and get refill reminders.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Heart,
      title: "Health Monitoring",
      description: "Track vital signs, symptoms, and health metrics. Get AI-powered insights about your health trends.",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: Users,
      title: "Family Health Hub",
      description: "Manage health records for your entire family from one account. Schedule appointments for all family members.",
      color: "from-teal-500 to-cyan-600"
    }
  ];

  const benefits = [
    "Reduce waiting times by 80%",
    "Access healthcare 24/7",
    "Save up to 60% on medical costs",
    "Get second opinions instantly",
    "Track health progress over time",
    "Connect with 2,500+ specialists"
  ];

  return (
    <div className="min-h-screen">
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
        {/* Hero Section */}
        <section className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Revolutionary Healthcare
                <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  At Your Fingertips
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover how MediMate is transforming healthcare with cutting-edge technology, 
                making quality medical care accessible, affordable, and convenient for everyone.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {features.map((feature, index) => (
                <Card key={index} className="glass-card hover-lift group">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-3xl shadow-xl p-12 mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MediMate?</h2>
                <p className="text-lg text-gray-600">
                  Join thousands of patients and healthcare providers who trust MediMate
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-800 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Built with Cutting-Edge Technology
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Our platform leverages artificial intelligence, machine learning, and advanced 
                  security protocols to deliver personalized healthcare experiences that adapt 
                  to your unique needs.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Mobile-First Design</h3>
                      <p className="text-gray-600 text-sm">Access healthcare on any device, anywhere</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Real-Time Updates</h3>
                      <p className="text-gray-600 text-sm">Instant notifications for appointments and results</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Award-Winning Security</h3>
                      <p className="text-gray-600 text-sm">Bank-level encryption and HIPAA compliance</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Platform Statistics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      {loading ? "..." : `${formatNumber(stats?.totalPatients || 0)}+`}
                    </div>
                    <div className="text-blue-100">Active Patients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      {loading ? "..." : `${formatNumber(stats?.activeDoctors || stats?.totalDoctors || 0)}+`}
                    </div>
                    <div className="text-blue-100">Healthcare Providers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">99.9%</div>
                    <div className="text-blue-100">Platform Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">4.9★</div>
                    <div className="text-blue-100">User Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Ready to Transform Your Healthcare Experience?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join MediMate today and discover how easy healthcare can be when technology 
                meets compassionate care.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href="/register">
                  <Button size="xl" className="btn-medical-primary">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" size="xl" className="btn-medical-secondary">
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      
    </div>
  );
}
