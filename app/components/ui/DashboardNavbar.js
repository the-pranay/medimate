'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Stethoscope, 
  User, 
  LogOut, 
  Bell, 
  Settings, 
  Menu, 
  X,
  ChevronDown,
  Calendar,
  Users,
  FileText,
  MessageCircle,
  Activity,
  Pill,
  Database,
  Server,
  Zap,
  MoreHorizontal
} from 'lucide-react';

export default function DashboardNavbar({ user, userRole, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const router = useRouter();
  const profileMenuRef = useRef(null);
  const moreMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setIsMoreMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      try {
        // Default logout behavior
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        
        // Force redirect to login page
        window.location.href = '/login';
      } catch (error) {
        console.error('Logout error:', error);
        // Fallback redirect
        window.location.href = '/login';
      }
    }
  };

  const getDashboardLinks = () => {
    if (userRole === 'doctor') {
      return [
        { name: 'Dashboard', href: '/doctor/dashboard', icon: Activity },
        { name: 'Appointments', href: '/doctor/appointments', icon: Calendar },
        { name: 'Patients', href: '/doctor/patients', icon: Users },
        { name: 'Reports', href: '/doctor/reports', icon: FileText },
        { name: 'Messages', href: '/doctor/messages', icon: MessageCircle },
      ];
    } else if (userRole === 'patient') {
      return [
        { name: 'Dashboard', href: '/patient/dashboard', icon: Activity },
        { name: 'Appointments', href: '/patient/appointments', icon: Calendar },
        { name: 'Doctors', href: '/patient/doctors', icon: Users },
        { name: 'Reports', href: '/patient/reports', icon: FileText },
        { name: 'Prescriptions', href: '/patient/prescriptions', icon: Pill },
        { name: 'Messages', href: '/patient/messages', icon: MessageCircle },
      ];
    } else {
      // Admin role - optimize for small screens
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: Activity, short: 'Home' },
        { name: 'Users', href: '/admin/users', icon: Users, short: 'Users' },
        { name: 'Doctors', href: '/admin/doctors', icon: Stethoscope, short: 'Docs' },
        { name: 'Patients', href: '/admin/patients', icon: Heart, short: 'Patients' },
        { name: 'Reports', href: '/admin/reports', icon: FileText, short: 'Reports' },
        { name: 'Database', href: '/admin/database', icon: Database, short: 'DB' },
        { name: 'Features', href: '/admin/features', icon: Zap, short: 'Features' },
        { name: 'Monitoring', href: '/admin/monitoring', icon: Server, short: 'Monitor' },
        { name: 'Settings', href: '/admin/settings', icon: Settings, short: 'Settings' },
      ];
    }
  };

  const dashboardLinks = getDashboardLinks();

  return (
    <nav className="bg-white/95 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-green-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <Heart className="w-4 h-4 text-white" />
                    <Stethoscope className="w-3 h-3 text-white/90 absolute top-0.5 left-0.5" />
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-lg font-black bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent">
                  MediMate
                </span>
                <span className="text-xs text-gray-500 font-medium uppercase">
                  {userRole === 'doctor' ? 'Doctor Portal' : userRole === 'patient' ? 'Patient Portal' : 'Admin Portal'}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Large screens */}
          <div className="hidden xl:flex items-center space-x-4">
            {dashboardLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-2 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  title={link.name}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Navigation - Medium screens */}
          <div className="hidden lg:flex xl:hidden items-center space-x-2">
            {dashboardLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-2 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  title={link.name}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-xs">{link.short || link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Navigation - Small screens with dropdown */}
          <div className="hidden md:flex lg:hidden items-center space-x-2">
            {dashboardLinks.slice(0, 5).map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  title={link.name}
                >
                  <Icon className="w-4 h-4" />
                </Link>
              );
            })}
            {dashboardLinks.length > 5 && (
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className="flex items-center text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  title="More options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {isMoreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {dashboardLinks.slice(5).map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsMoreMenuOpen(false)}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{link.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Profile & Notifications */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                3
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-2 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
                <ChevronDown className="w-4 h-4 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    href={userRole === 'doctor' ? '/doctor-profile' : userRole === 'patient' ? '/patient-profile' : '/admin-profile'}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href={userRole === 'doctor' ? '/doctor-settings' : userRole === 'patient' ? '/patient-settings' : '/admin-settings'}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {dashboardLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
