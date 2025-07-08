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
                <a 
                  href="https://www.instagram.com/the._pranay/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com/in/pranaysangolkar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://github.com/the-pranay" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
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
                  <Link href="/patient/dashboard" className="hover:text-blue-300 transition-colors flex items-center group">
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
                  <Link href="/doctor/dashboard" className="hover:text-green-300 transition-colors flex items-center group">
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
                  <Link href="/patient/reports" className="hover:text-green-300 transition-colors flex items-center group">
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
              © {currentYear} MediMate. All rights reserved. 
              <a 
                href="https://github.com/the-pranay" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors ml-1"
              >
                Developed by the-pranay
              </a>
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
