'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Heart, Stethoscope, Users, Activity, ArrowRight, Shield, Zap, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { renderButtonLoader } from '../utils/loaders';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser, loading, error, isAuthenticated, user, clearErrors } = useAuth();
  const initialRole = searchParams.get('role') || 'patient';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: initialRole,
    address: '',
    age: '',
    gender: '',
    specialization: '', // for doctors
    experience: '', // for doctors
    licenseNumber: '' // for doctors
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user && !loading && !isRedirecting) {
      console.log('🔄 Register page: Redirecting authenticated user:', user?.role || 'unknown');
      setIsRedirecting(true);
      const redirectPath = user?.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
      
      // Add a small delay to prevent rapid redirects
      setTimeout(() => {
        router.replace(redirectPath);
      }, 100);
    }
  }, [isAuthenticated, user, loading, router, isRedirecting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Clear global error
    if (error) {
      clearErrors();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    // Doctor-specific validation
    if (formData.role === 'doctor') {
      if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
      if (!formData.experience) newErrors.experience = 'Experience is required';
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors above');
      return;
    }

    try {
      const result = await registerUser(formData);
      
      if (result.success) {
        if (formData.role === 'doctor') {
          toast.success('Registration successful! Your account is pending admin verification. You will be notified once approved.');
        } else {
          toast.success('Registration successful! Welcome to MediMate!');
        }
        // Don't manually redirect - let the useEffect handle it based on user role
        // The useEffect will automatically redirect to the appropriate dashboard
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
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
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-green-300/20 rounded-full opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 5 + 2}px`,
                height: `${Math.random() * 5 + 2}px`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${Math.random() * 12 + 8}s`,
              }}
            />
          ))}
        </div>
        
        {/* Medical Icons Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Heart className="absolute top-32 left-16 w-6 h-6 text-green-500/20 animate-pulse" />
          <Stethoscope className="absolute top-48 right-32 w-8 h-8 text-blue-500/20 animate-bounce" />
          <Activity className="absolute bottom-48 left-32 w-7 h-7 text-green-500/20 animate-pulse" />
          <Shield className="absolute bottom-32 right-16 w-6 h-6 text-blue-500/20 animate-bounce" />
          <Users className="absolute top-2/3 left-1/4 w-5 h-5 text-green-600/20 animate-pulse" />
          <Sparkles className="absolute top-1/3 right-1/4 w-6 h-6 text-blue-600/20 animate-bounce" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div 
                className="relative bg-gradient-to-r from-green-500 via-blue-500 to-green-600 p-4 rounded-full shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-12"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Users className={`w-8 h-8 text-white transition-all duration-300 ${isHovered ? 'animate-pulse' : ''}`} />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-green-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
              </div>
            </div>
            
            <Link href="/" className="text-5xl font-black bg-gradient-to-r from-green-600 via-blue-600 to-green-700 bg-clip-text text-transparent hover:from-green-700 hover:via-blue-700 hover:to-green-800 transition-all duration-300">
              MediMate
            </Link>
            
            <h2 className="mt-6 text-3xl font-extrabold text-gray-800 animate-fade-in">
              Join MediMate! 🏥
            </h2>
            <p className="mt-2 text-lg text-gray-600 animate-fade-in-delay">
              Ready to make a difference in healthcare? Let's create your medical profile!
            </p>
          </div>

          {/* Glass Card with Neon Effect */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-blue-500 to-green-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-green-200/50">
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Role Selection */}
                <div className="text-center mb-8">
                  <p className="text-gray-700 mb-4 text-sm font-medium">Choose your account type:</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'patient' }))}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                        formData.role === 'patient'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      <Heart className="w-5 h-5" />
                      <span>Patient Account 🏥</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'doctor' }))}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                        formData.role === 'doctor'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      <Stethoscope className="w-5 h-5" />
                      <span>Doctor Account 👨‍⚕️</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Basic Info
                    </h3>
                    
                    {/* Name */}
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
                        Full Name 🏷️
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-hover:text-purple-600 transition-colors z-10" />
                        <input
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                        Email Address ✉️
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors z-10" />
                        <input
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                          placeholder="your.email@medimate.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-green-600 transition-colors">
                        Phone Number 📞
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-hover:text-green-600 transition-colors z-10" />
                        <input
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                          placeholder="Your contact number"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Age & Gender */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age 🎂
                        </label>
                        <input
                          name="age"
                          type="number"
                          required
                          value={formData.age}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                          placeholder="25"
                        />
                        {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                      </div>

                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender 🚻
                        </label>
                        <select
                          name="gender"
                          required
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Security & Additional Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Security & Details
                    </h3>

                    {/* Password */}
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
                        Password 🔐
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-hover:text-purple-600 transition-colors z-10" />
                        <input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-10 pr-12 py-3 bg-white/80 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                          placeholder="Your secret power"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-purple-600 transition-colors z-10"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
                        Confirm Password 🔒
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-hover:text-pink-600 transition-colors z-10" />
                        <input
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-12 py-3 bg-white/80 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                          placeholder="Confirm your secret power"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-pink-600 transition-colors z-10"
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </button>
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-teal-600 transition-colors">
                        Address 📍
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-hover:text-teal-600 transition-colors z-10" />
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows={3}
                          className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                          placeholder="Your address"
                        />
                      </div>
                    </div>

                    {/* Doctor-specific fields */}
                    {formData.role === 'doctor' && (
                      <div className="space-y-4 pt-4 border-t border-gray-300">
                        <h4 className="text-md font-medium text-blue-600 flex items-center">
                          <Stethoscope className="w-4 h-4 mr-2" />
                          Doctor Credentials
                        </h4>
                        
                        {/* Specialization */}
                        <div className="group">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Specialization 🏥
                          </label>
                          <input
                            name="specialization"
                            type="text"
                            value={formData.specialization}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                            placeholder="e.g., Cardiology, Pediatrics"
                          />
                          {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
                        </div>

                        {/* Experience & License */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Experience (years) 📅
                            </label>
                            <input
                              name="experience"
                              type="number"
                              value={formData.experience}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                              placeholder="5"
                            />
                            {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                          </div>

                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              License Number 📜
                            </label>
                            <input
                              name="licenseNumber"
                              type="text"
                              value={formData.licenseNumber}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
                              placeholder="MD123456"
                            />
                            {errors.licenseNumber && <p className="text-red-500 text-xs mt-1">{errors.licenseNumber}</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {loading ? (
                      renderButtonLoader({ color: 'white', size: 'sm' })
                    ) : (
                      <Zap className="h-5 w-5 text-white group-hover:animate-pulse" />
                    )}
                  </span>
                  {loading ? 'Creating Account...' : 'Create Account 🏥'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Already have a MediMate account?{' '}
                  <Link href="/login" className="font-medium text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text hover:from-green-700 hover:to-blue-700 transition-all duration-300">
                    Sign in here! �
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

export default function Register() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>}>
      <RegisterForm />
    </Suspense>
  );
}
