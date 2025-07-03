import Link from 'next/link';
import { ArrowLeft, Heart, Users, Award, Shield, Globe, Stethoscope } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
  
      
      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
              About <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">MediMate</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing healthcare through innovative technology, connecting patients and doctors in a seamless digital ecosystem.
            </p>
          </div>
          
          {/* Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                To democratize healthcare access and improve patient outcomes through cutting-edge technology, 
                making quality medical care available to everyone, everywhere.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                We believe that healthcare should be accessible, affordable, and efficient. Our platform bridges 
                the gap between patients and healthcare providers, creating a seamless experience that puts 
                patient care at the center of everything we do.
              </p>
            </div>
            <div className="medical-card text-center p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-medical">
                <Heart className="w-12 h-12 text-white animate-heartbeat" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Patient-Centered Care</h3>
              <p className="text-slate-600">
                Every feature is designed with patient well-being and healthcare accessibility in mind.
              </p>
            </div>
          </div>
          
          {/* Values */}
          <div className="mb-24">
            <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Security & Privacy",
                  description: "HIPAA-compliant platform with bank-level security to protect sensitive health data."
                },
                {
                  icon: Users,
                  title: "Accessibility",
                  description: "Making healthcare accessible to all, regardless of location or economic status."
                },
                {
                  icon: Award,
                  title: "Excellence",
                  description: "Committed to the highest standards of medical care and technological innovation."
                }
              ].map((value, index) => (
                <div key={index} className="medical-card text-center hover-lift-medical">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-medical-glow">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
                  <p className="text-slate-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Team Section */}
          <div className="mb-24">
            <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Dr. Sarah Johnson",
                  role: "Chief Medical Officer",
                  image: "👩‍⚕️",
                  bio: "20+ years in emergency medicine and healthcare technology innovation."
                },
                {
                  name: "Michael Chen",
                  role: "Chief Technology Officer",
                  image: "👨‍💻",
                  bio: "Former Google engineer specializing in healthcare AI and data security."
                },
                {
                  name: "Dr. Emily Rodriguez",
                  role: "Head of Patient Experience",
                  image: "👩‍⚕️",
                  bio: "Pediatrician and patient advocacy expert with 15+ years experience."
                }
              ].map((member, index) => (
                <div key={index} className="medical-card text-center hover-lift-medical">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-slate-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center">
            <div className="medical-card max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Join Our Mission</h2>
              <p className="text-lg text-slate-600 mb-8">
                Be part of the healthcare revolution. Together, we can make quality healthcare accessible to everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button className="btn-medical-primary">
                    Get Started Today
                  </Button>
                </Link>
                <Link href="#contact">
                  <Button className="btn-medical-secondary">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
