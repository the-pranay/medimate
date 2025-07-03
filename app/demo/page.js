import Link from 'next/link';
import { Play, Calendar, FileText, Users, Shield, ArrowRight, CheckCircle, ArrowLeft, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import HeartbeatMonitor from '../components/ui/HeartbeatMonitor';
import DoctorPatientAnimation from '../components/ui/DoctorPatientAnimation';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
              See MediMate in <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">Action</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the future of healthcare technology through our interactive demo showcasing real-world medical scenarios.
            </p>
          </div>
          
          {/* Video Demo Section */}
          <div className="mb-24">
            <div className="medical-card max-w-4xl mx-auto text-center">
              <div className="relative bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-16 mb-8">
                <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-white/30 transition-colors cursor-pointer">
                    <Play className="w-12 h-12 text-white ml-1" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Watch Our Platform Demo</h2>
                  <p className="text-blue-100 text-lg">
                    5-minute walkthrough of key features and real patient scenarios
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">5:32</div>
                  <div className="text-slate-600 text-sm">Demo Duration</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-600">15+</div>
                  <div className="text-slate-600 text-sm">Features Shown</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">3</div>
                  <div className="text-slate-600 text-sm">User Scenarios</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Interactive Demo Features */}
          <div className="mb-24">
            <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Interactive Demo Features</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Patient Journey */}
              <div className="medical-card">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Patient Journey Demo</h3>
                <div className="space-y-4 mb-6">
                  {[
                    "Account creation and profile setup",
                    "Symptom checker and AI triage",
                    "Doctor search and appointment booking",
                    "Telemedicine consultation",
                    "Prescription and follow-up care"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="text-slate-700">{step}</span>
                    </div>
                  ))}
                </div>
                <Button className="btn-medical-primary w-full">
                  <Users className="w-5 h-5 mr-2" />
                  Try Patient Demo
                </Button>
              </div>
              
              {/* Doctor Dashboard */}
              <div className="medical-card">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Doctor Dashboard Demo</h3>
                <div className="space-y-4 mb-6">
                  {[
                    "Practice management overview",
                    "Patient records and history",
                    "Appointment scheduling system",
                    "Telemedicine consultation tools",
                    "Prescription and billing features"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-teal-600 text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="text-slate-700">{step}</span>
                    </div>
                  ))}
                </div>
                <Button className="btn-medical-secondary w-full">
                  <Shield className="w-5 h-5 mr-2" />
                  Try Doctor Demo
                </Button>
              </div>
            </div>
          </div>
          
          {/* Live Demo Animations */}
          <div className="mb-24">
            <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Live Medical Animations</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="medical-card">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Real-time Health Monitoring</h3>
                <HeartbeatMonitor />
                <p className="text-slate-600 mt-4 text-sm">
                  Experience our real-time patient monitoring dashboard with live vitals tracking.
                </p>
              </div>
              
              <div className="medical-card">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Telemedicine Connection</h3>
                <DoctorPatientAnimation />
                <p className="text-slate-600 mt-4 text-sm">
                  See how our platform seamlessly connects doctors and patients for virtual consultations.
                </p>
              </div>
            </div>
          </div>
          
          {/* Demo Benefits */}
          <div className="mb-24">
            <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Why Choose Our Demo?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Play,
                  title: "Interactive Experience",
                  description: "Hands-on demo with real scenarios"
                },
                {
                  icon: Calendar,
                  title: "Real-time Features",
                  description: "Live appointment booking system"
                },
                {
                  icon: FileText,
                  title: "Actual Data",
                  description: "Sample patient records and reports"
                },
                {
                  icon: Shield,
                  title: "Security Demo",
                  description: "See our security features in action"
                }
              ].map((benefit, index) => (
                <div key={index} className="medical-card text-center hover-lift-medical">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-medical-glow">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center">
            <div className="medical-card max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to Get Started?</h2>
              <p className="text-lg text-slate-600 mb-8">
                After seeing our demo, join thousands of healthcare professionals and patients who trust MediMate.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/register">
                  <Button className="btn-medical-primary">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="btn-medical-secondary">
                    Schedule Personal Demo
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center justify-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Free 30-day trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Setup assistance included
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
