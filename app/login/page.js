'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Heart, Stethoscope, ArrowRight, Shield, Users, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loading, error, isAuthenticated, user, clearErrors } = useAuth();
  const message = searchParams.get('message');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user && !loading && !isRedirecting) {
      console.log('🔄 Login page: Redirecting authenticated user:', user?.role || 'unknown');
      setIsRedirecting(true);
      const redirectPath = user?.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';
      
      // Add a small delay to prevent rapid redirects
      setTimeout(() => {
        router.replace(redirectPath);
      }, 100);
    }
  }, [isAuthenticated, user, loading, router, isRedirecting]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) {
      clearErrors();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      
      if (result.success) {
        toast.success('Login successful!');
        
        // Redirect based on user role
        const redirectPath = result.data.user?.role === 'doctor' 
          ? '/doctor-dashboard' 
          : '/patient-dashboard';
        router.push(redirectPath);
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 via-white/80 to-blue-100/50"></div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-green-300/20 rounded-full opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>
        
        {/* Medical Icons Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Heart className="absolute top-20 left-20 w-8 h-8 text-green-500/20 animate-pulse" />
          <Stethoscope className="absolute top-40 right-40 w-10 h-10 text-blue-500/20 animate-bounce" />
          <Activity className="absolute bottom-40 left-40 w-6 h-6 text-green-500/20 animate-pulse" />
          <Shield className="absolute bottom-20 right-20 w-8 h-8 text-blue-500/20 animate-bounce" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 my-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div 
                className="relative bg-gradient-to-r from-green-500 via-blue-500 to-green-600 p-4 rounded-full shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-12"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Heart className={`w-8 h-8 text-white transition-all duration-300 ${isHovered ? 'animate-pulse' : ''}`} />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-green-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
              </div>
            </div>
            
            <Link href="/" className="text-5xl font-black bg-gradient-to-r from-green-600 via-blue-600 to-green-700 bg-clip-text text-transparent hover:from-green-700 hover:via-blue-700 hover:to-green-800 transition-all duration-300">
              MediMate
            </Link>
            
            <h2 className="mt-6 text-3xl font-extrabold text-gray-800 animate-fade-in">
              Welcome Back! 🩺
            </h2>
            <p className="mt-2 text-lg text-gray-600 animate-fade-in-delay">
              Ready to save lives today? Let's get you signed in!
            </p>
          </div>

          {/* Glass Card with Neon Effect */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-blue-500 to-green-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-green-200/50">
              
              {message && (
                <div className="mb-6 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-green-600 mr-3" />
                    <p className="text-sm text-green-700">{message}</p>
                  </div>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Email Field */}
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-green-600 transition-colors">
                      Email Address ✉️
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-hover:text-green-600 transition-colors z-10" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/80 border border-green-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                        placeholder="Enter your medical email"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-100/20 via-blue-100/20 to-green-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="group">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                      Password 🔐
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors z-10" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 bg-white/80 border border-green-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                        placeholder="Enter your secret code"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-blue-600 transition-colors z-10"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-100/20 via-green-100/20 to-blue-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded bg-white"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-600">
                      Remember my credentials
                    </label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    Forgot your powers?
                  </Link>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-300 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-green-600 via-blue-600 to-green-700 hover:from-green-700 hover:via-blue-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
                    )}
                  </span>
                  {loading ? 'Signing In...' : 'Sign In to Continue 🩺'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  New to our squad?{' '}
                  <Link href="/register" className="font-medium text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text hover:from-green-700 hover:to-blue-700 transition-all duration-300">
                    Join the mission! 🎯
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-blue-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>}>
      <LoginForm />
    </Suspense>
  );
}
