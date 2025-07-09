import Link from 'next/link';
import { 
  Calendar, 
  Shield, 
  Users, 
  ArrowRight, 
  Heart, 
  CheckCircle, 
  Stethoscope,
  Clock,
  Globe,
  Phone,
  Video,
  FileText,
  User
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      
      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
              Our <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive healthcare solutions designed to provide you with seamless medical care. 
              Sign in to access all features from your personalized dashboard.
            </p>
          </div>
          
          {/* Main Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            
            {/* Book Appointment Service */}
            <div className="medical-card group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Book Appointment</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Schedule appointments with our network of qualified healthcare specialists. 
                  Access your booking dashboard to choose from available time slots and get confirmed bookings instantly.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-600">Access from your dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-600">Instant booking confirmation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-600">Specialist selection</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-600">Automated reminders</span>
                  </div>
                </div>
                
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 group flex items-center justify-center space-x-2">
                    <span>Sign In to Schedule</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Health Records Service */}
            <div className="medical-card group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Health Records</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Securely store, manage, and access your complete medical history from your personal dashboard. 
                  Keep all your health information organized and readily available to share with healthcare providers.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-600">Dashboard integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-600">Secure data encryption</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-600">Easy sharing with doctors</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-600">24/7 access</span>
                  </div>
                </div>
                
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 group flex items-center justify-center space-x-2">
                    <span>Sign In to Access</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Telemedicine Service */}
            <div className="medical-card group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Telemedicine</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Connect with healthcare providers through secure video consultations from your dashboard. 
                  Access messaging, video calls, and get medical advice from the comfort of your home.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-600">Integrated messaging system</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-600">HD video consultations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-600">Digital prescriptions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-600">Follow-up care</span>
                  </div>
                </div>
                
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 group flex items-center justify-center space-x-2">
                    <span>Sign In to Connect</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Additional Services Section */}
          <div className="mb-24">
            <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">
              Why Choose <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">MediMate</span>?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">24/7 Availability</h3>
                <p className="text-slate-600 text-sm">Access healthcare services anytime, anywhere</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Expert Doctors</h3>
                <p className="text-slate-600 text-sm">Qualified and experienced healthcare professionals</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure & Private</h3>
                <p className="text-slate-600 text-sm">HIPAA-compliant security for your data</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Global Access</h3>
                <p className="text-slate-600 text-sm">Connect with healthcare worldwide</p>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="medical-card text-center p-12">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-medical">
              <Heart className="w-12 h-12 text-white animate-heartbeat" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust MediMate for their healthcare needs. 
              Experience the future of medical care today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-2 border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600 font-semibold px-8 py-4 rounded-xl transition-all duration-300">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
