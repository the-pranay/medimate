import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-green-800 to-blue-900"></div>
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Floating elements for visual appeal */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000 transform -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">❤️</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-green-300 bg-clip-text text-transparent">
                  MediMate
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Making healthcare accessible and convenient for everyone. Your health, our priority - always.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center cursor-pointer transition-colors group">
                  <span className="text-sm group-hover:scale-110 transition-transform">📘</span>
                </div>
                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center cursor-pointer transition-colors group">
                  <span className="text-sm group-hover:scale-110 transition-transform">🐦</span>
                </div>
                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center cursor-pointer transition-colors group">
                  <span className="text-sm group-hover:scale-110 transition-transform">📷</span>
                </div>
                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center cursor-pointer transition-colors group">
                  <span className="text-sm group-hover:scale-110 transition-transform">💼</span>
                </div>
              </div>
            </div>
            
            {/* For Patients */}
            <div>
              <h4 className="font-semibold text-white mb-6 text-lg">For Patients</h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <Link href="/book-appointment" className="hover:text-blue-300 transition-colors flex items-center group">
                    <span className="mr-2 group-hover:scale-110 transition-transform">📅</span>
                    Book Appointment
                  </Link>
                </li>
                <li>
                  <Link href="/my-reports" className="hover:text-blue-300 transition-colors flex items-center group">
                    <span className="mr-2 group-hover:scale-110 transition-transform">📄</span>
                    My Reports
                  </Link>
                </li>
                <li>
                  <Link href="/messages" className="hover:text-blue-300 transition-colors flex items-center group">
                    <span className="mr-2 group-hover:scale-110 transition-transform">💬</span>
                    Telemedicine
                  </Link>
                </li>
                <li>
                  <Link href="/patient-dashboard" className="hover:text-blue-300 transition-colors flex items-center group">
                    <span className="mr-2 group-hover:scale-110 transition-transform">🏠</span>
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* For Doctors */}
            <div>
              <h4 className="font-semibold text-white mb-6 text-lg">For Doctors</h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <Link href="/doctor-dashboard" className="hover:text-green-300 transition-colors flex items-center group">
                    <span className="mr-2 group-hover:scale-110 transition-transform">🩺</span>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/manage-appointments" className="hover:text-green-300 transition-colors flex items-center group">
                    <span className="mr-2 group-hover:scale-110 transition-transform">📋</span>
                    Manage Appointments
                  </Link>
                </li>
                <li>
                  <Link href="/patient-reports" className="hover:text-green-300 transition-colors flex items-center group">
                    <span className="mr-2 group-hover:scale-110 transition-transform">📊</span>
                    Patient Reports
                  </Link>
                </li>
                <li>
                  <Link href="/prescriptions" className="hover:text-green-300 transition-colors flex items-center group">
                    <span className="mr-2 group-hover:scale-110 transition-transform">💊</span>
                    Prescriptions
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Support & Legal */}
            <div>
              <h4 className="font-semibold text-white mb-6 text-lg">Support & Legal</h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <Link href="/help" className="hover:text-purple-400 transition-colors flex items-center">
                    <span className="mr-2">❓</span>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-purple-400 transition-colors flex items-center">
                    <span className="mr-2">📞</span>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-purple-400 transition-colors flex items-center">
                    <span className="mr-2">🔒</span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-purple-400 transition-colors flex items-center">
                    <span className="mr-2">📋</span>
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Newsletter Subscription */}
          <div className="border-t border-white/10 pt-8 mb-8">
            <div className="text-center max-w-2xl mx-auto">
              <h4 className="text-2xl font-bold text-white mb-4">Stay Updated</h4>
              <p className="text-gray-300 mb-6">
                Get the latest health tips and platform updates delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
                <button 
                  onClick={() => {
                    // Newsletter subscription functionality
                    const email = document.querySelector('input[type="email"]')?.value;
                    if (email) {
                      toast.success('Thank you for subscribing to our newsletter!');
                      document.querySelector('input[type="email"]').value = '';
                    } else {
                      toast.error('Please enter a valid email address');
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} MediMate. All rights reserved. Made with ❤️ for better healthcare.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                99.9% Uptime
              </span>
              <span className="flex items-center">
                <span className="mr-2">🔒</span>
                HIPAA Compliant
              </span>
              <span className="flex items-center">
                <span className="mr-2">⚡</span>
                24/7 Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
