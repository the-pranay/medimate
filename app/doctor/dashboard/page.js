'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  Bell,
  LogOut,
  Plus,
  Eye,
  MessageCircle,
  Award,
  TrendingUp,
  Stethoscope,
  Activity,
  Heart,
  Shield,
  Video // Add Video icon
} from 'lucide-react';
import ThemedDashboard from '../../components/ui/ThemedDashboard';
import DashboardNavbar from '../../components/ui/DashboardNavbar';
import { PageLoader } from '../../components/ui/HealthcareLoaders';

export default function DoctorDashboard() {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    completedAppointments: 0,
    activeReports: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctor data and dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('🔍 Doctor Dashboard: Starting data fetch...');
        
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const userRole = localStorage.getItem('userRole');
        const userStr = localStorage.getItem('user');
        
        console.log('🔍 Doctor Dashboard: Checking auth...', {
          hasToken: !!token,
          userRole: userRole,
          hasUser: !!userStr
        });
        
        // Try to get role from stored user object if userRole is not set
        let role = userRole;
        if (!role && userStr) {
          try {
            const user = JSON.parse(userStr);
            role = user.role;
            console.log('🔍 Doctor Dashboard: Got role from user object:', role);
          } catch (e) {
            console.error('🔍 Doctor Dashboard: Error parsing user from localStorage:', e);
          }
        }
        
        if (!token) {
          console.log('🔍 Doctor Dashboard: No token found, redirecting to login');
          router.push('/login');
          return;
        }
        
        if (role && role !== 'doctor') {
          console.log('🔍 Doctor Dashboard: User is not a doctor, redirecting to correct dashboard');
          const redirectPath = role === 'patient' ? '/patient/dashboard' : '/login';
          router.push(redirectPath);
          return;
        }
        
        // Check if doctor is verified
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user.role === 'doctor' && !user.isVerified) {
              console.log('🔍 Doctor Dashboard: Doctor not verified, redirecting to pending page');
              router.push('/doctor/verification-pending');
              return;
            }
          } catch (e) {
            console.error('🔍 Doctor Dashboard: Error parsing user from localStorage:', e);
          }
        }
        
        console.log('🔍 Doctor Dashboard: Auth check passed, fetching data...');

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        // Fetch doctor profile
        console.log('🔍 Doctor Dashboard: Fetching profile...');
        const doctorResponse = await fetch('/api/users/profile', { headers });
        if (doctorResponse.ok) {
          const doctorData = await doctorResponse.json();
          console.log('🔍 Doctor Dashboard: Profile fetched:', doctorData.success);
          if (doctorData.success) {
            setDoctor(doctorData.data);
            
            // Double-check that this is actually a doctor
            if (doctorData.data.role !== 'doctor') {
              console.log('🔍 Doctor Dashboard: Profile shows user is not a doctor, redirecting');
              const redirectPath = doctorData.data.role === 'patient' ? '/patient/dashboard' : '/login';
              router.push(redirectPath);
              return;
            }
          }
        } else {
          console.error('🔍 Doctor Dashboard: Profile fetch failed:', doctorResponse.status);
        }

        // Fetch today's appointments
        console.log('🔍 Doctor Dashboard: Fetching appointments...');
        let validAppointments = [];
        const appointmentsResponse = await fetch('/api/appointments?today=true', { headers });
        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json();
          // Filter out appointments with null doctor or patient
          validAppointments = (appointmentsData.data || []).filter(apt => 
            apt && apt.patient && apt.doctor
          );
          setTodayAppointments(validAppointments);
        }

        // Fetch all appointments for stats
        const allAppointmentsResponse = await fetch('/api/appointments', { headers });
        if (allAppointmentsResponse.ok) {
          const allAppointmentsData = await allAppointmentsResponse.json();
          const allAppointments = (allAppointmentsData.data || []).filter(apt => 
            apt && apt.patient && apt.doctor
          );
          
          // Calculate stats
          const completedAppointments = allAppointments.filter(apt => apt.status === 'completed').length;
          const uniquePatients = [...new Set(allAppointments.map(apt => apt.patient?._id))].filter(id => id).length;
          
          setStats(prev => ({
            ...prev,
            totalPatients: uniquePatients,
            completedAppointments: completedAppointments,
            todayAppointments: validAppointments?.length || 0
          }));
        }

        // Fetch medical reports
        const reportsResponse = await fetch('/api/medical-records/reports', { headers });
        if (reportsResponse.ok) {
          const reportsData = await reportsResponse.json();
          const reports = reportsData.data || [];
          setPendingReports(reports.filter(report => report.status === 'active'));
          setStats(prev => ({
            ...prev,
            activeReports: reports.filter(report => report.status === 'active').length
          }));
        }

        // Fetch messages/conversations
        const messagesResponse = await fetch('/api/messages/conversations', { headers });
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          const conversations = messagesData.data || [];
          setRecentMessages(conversations);
          const unreadCount = conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
          setStats(prev => ({
            ...prev,
            unreadMessages: unreadCount
          }));
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to login page
    router.push('/login');
  };

  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const status = action === 'approve' ? 'confirmed' : 'cancelled';
      
      const response = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update local state
          setTodayAppointments(prev => 
            prev.map(apt => 
              (apt._id || apt.id) === appointmentId 
                ? { ...apt, status: status }
                : apt
            )
          );
          
          // Show success message
          alert(`Appointment ${status} successfully!`);
        } else {
          throw new Error(result.message || 'Failed to update appointment');
        }
      } else {
        throw new Error('Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Error updating appointment: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadMessages = recentMessages.filter(msg => msg.unread);
  const confirmedAppointments = todayAppointments.filter(apt => apt.status === 'confirmed');
  const pendingAppointments = todayAppointments.filter(apt => apt.status === 'pending');

  console.log('🔍 Doctor Dashboard: Rendering dashboard', {
    loading,
    error,
    doctor: doctor ? 'loaded' : 'null',
    appointmentsCount: todayAppointments.length
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <PageLoader 
          type="dashboard" 
          size="lg" 
          color="primary" 
          text="Loading your doctor dashboard..." 
          fullScreen={false} 
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4 font-semibold">{error}</p>
          <p className="text-gray-600 mb-6 text-sm">
            We're having trouble loading your dashboard. This might be due to a network issue or server problem.
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button 
              onClick={() => router.push('/login')} 
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemedDashboard role="doctor">
      {/* Dashboard Navigation */}
      <DashboardNavbar 
        user={doctor} 
        userRole="doctor" 
        onLogout={handleLogout}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-green-100 animate-pulse">
          <Stethoscope className="w-12 h-12" />
        </div>
        <div className="absolute top-40 right-40 text-teal-100 animate-pulse" style={{ animationDelay: '1s' }}>
          <Heart className="w-8 h-8" />
        </div>
        <div className="absolute bottom-40 left-40 text-green-100 animate-pulse" style={{ animationDelay: '2s' }}>
          <Activity className="w-10 h-10" />
        </div>
        <div className="absolute bottom-20 right-20 text-teal-100 animate-pulse" style={{ animationDelay: '3s' }}>
          <Shield className="w-6 h-6" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-full mr-4">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Welcome, Dr. {doctor?.name?.split(' ')[1] || doctor?.name || 'Doctor'}! 👨‍⚕️
              </h1>
              <p className="text-gray-600 mt-2">Your patients depend on your expertise</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="medical-card hover:shadow-green-500/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-green-600">{stats?.todayAppointments || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="medical-card hover:shadow-teal-500/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-3 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-teal-600">{stats?.totalPatients || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="medical-card hover:shadow-purple-500/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-full">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                <p className="text-2xl font-bold text-purple-600">{stats?.pendingReports || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="medical-card hover:shadow-yellow-500/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-full">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.rating || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Appointments */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {confirmedAppointments.length} confirmed, {pendingAppointments.length} pending
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {todayAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => (
                      <div key={appointment._id || appointment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{appointment.patient?.name || 'Unknown Patient'}</h3>
                                <p className="text-sm text-gray-600">{appointment.patient?.age || 'N/A'} years, {appointment.patient?.gender || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {appointment.appointmentTime || appointment.time || 'N/A'}
                              </div>
                              <span>•</span>
                              <span>{appointment.type || appointment.reasonForVisit || 'General'}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                            {appointment.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleAppointmentAction(appointment._id || appointment.id, 'approve')}
                                  className="p-1 text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleAppointmentAction(appointment._id || appointment.id, 'decline')}
                                  className="p-1 text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </div>
                            )}
                            {appointment.status === 'confirmed' && (
                              <button
                                onClick={() => router.push(`/video-call?appointmentId=${appointment._id || appointment.id}`)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-xs font-medium inline-flex items-center"
                                title="Start Video Call"
                              >
                                <Video className="h-3 w-3 mr-1" />
                                Video Call
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No appointments for today</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pending Reports */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Reports to Review</h2>
                  <Link 
                    href="/doctor/reports"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {pendingReports.length > 0 ? (
                  <div className="space-y-4">
                    {pendingReports.map((report) => (
                      <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{report.patient}</h3>
                            <p className="text-sm text-gray-600">{report.type}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <FileText className="h-4 w-4 mr-1" />
                              Uploaded on {new Date(report.uploadedDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => {
                                // Review report functionality
                                toast.info('Review report functionality - Coming soon!');
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Review
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No reports to review</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Doctor Profile */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile</h3>
              <div className="text-center mb-4">
                <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900">{doctor?.name || 'Doctor'}</h4>
                <p className="text-sm text-gray-600">{doctor?.specialization || 'Specialist'}</p>
                <div className="flex items-center justify-center mt-2">
                  <Award className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{doctor?.rating || '0'}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-800">Experience</span>
                  <span className="font-medium text-gray-800">{doctor?.experience || '0'} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800">License</span>
                  <span className="font-medium text-gray-800">{doctor?.licenseNumber || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800">Total Patients</span>
                  <span className="font-medium text-gray-800">{doctor?.totalPatients || 0}</span>
                </div>
              </div>
              <Link 
                href="/doctor/profile"
                className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium inline-block text-center"
              >
                Edit Profile
              </Link>
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
                  <Link 
                    href="/doctor/messages"
                    className="text-blue-600 hover:text-blue-500 font-medium text-sm"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {recentMessages.length > 0 ? (
                  <div className="space-y-4">
                    {recentMessages.map((message) => (
                      <div key={message.id} className={`p-3 rounded-lg ${message.unread ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm text-gray-900">{message.patient}</p>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{message.message}</p>
                        {message.unread && (
                          <span className="inline-block mt-2 text-xs text-blue-600 font-medium">New</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No messages</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  href="/doctor/appointments"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium inline-flex items-center justify-center"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Schedule
                </Link>
                <Link 
                  href="/create-prescription"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium inline-flex items-center justify-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Prescription
                </Link>
                <Link 
                  href="/doctor/messages"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium inline-flex items-center justify-center"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Patient Messages
                </Link>
                <Link 
                  href="/doctor/reports"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium inline-flex items-center justify-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Review Reports
                </Link>
                <Link 
                  href="/doctor/prescriptions"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg text-sm font-medium inline-flex items-center justify-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Prescriptions
                </Link>
              </div>
            </div>

            {/* Monthly Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Appointments</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats?.monthlyAppointments || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">New Patients</span>
                  </div>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-600">Reports Reviewed</span>
                  </div>
                  <span className="font-semibold text-gray-900">34</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </ThemedDashboard>
  );
}
