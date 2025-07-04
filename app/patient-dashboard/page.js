'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  FileText, 
  MessageCircle, 
  User, 
  Bell, 
  Clock, 
  Phone,
  MapPin,
  Plus,
  Download,
  Eye,
  LogOut,
  Heart,
  Activity,
  TrendingUp,
  Shield
} from 'lucide-react';
import ThemedDashboard from '../components/ui/ThemedDashboard';

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data and dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('🔍 Patient Dashboard: Starting data fetch...');
        
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const userRole = localStorage.getItem('userRole');
        const userStr = localStorage.getItem('user');
        
        console.log('🔍 Patient Dashboard: Checking auth...', {
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
            console.log('🔍 Patient Dashboard: Got role from user object:', role);
          } catch (e) {
            console.error('🔍 Patient Dashboard: Error parsing user from localStorage:', e);
          }
        }
        
        if (!token) {
          console.log('🔍 Patient Dashboard: No token found, redirecting to login');
          router.push('/login');
          return;
        }
        
        if (role && role !== 'patient') {
          console.log('🔍 Patient Dashboard: User is not a patient, redirecting to correct dashboard');
          const redirectPath = role === 'doctor' ? '/doctor-dashboard' : '/login';
          router.push(redirectPath);
          return;
        }
        
        console.log('🔍 Patient Dashboard: Auth check passed, fetching data...');

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        // Fetch user profile
        const userResponse = await fetch('/api/users/profile', { headers });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.data);
        }

        // Fetch appointments
        const appointmentsResponse = await fetch('/api/appointments', { headers });
        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json();
          // Filter out appointments with null doctor or patient
          const validAppointments = (appointmentsData.data || []).filter(apt => 
            apt && apt.patient && apt.doctor
          );
          setAppointments(validAppointments);
        }

        // Fetch medical reports
        const reportsResponse = await fetch('/api/medical-records/reports', { headers });
        if (reportsResponse.ok) {
          const reportsData = await reportsResponse.json();
          setReports(reportsData.data || []);
        }

        // Fetch messages/conversations
        const messagesResponse = await fetch('/api/messages/conversations', { headers });
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setMessages(messagesData.data || []);
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
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Calculate dashboard statistics
  const upcomingAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(apt.appointmentDate);
    const today = new Date();
    return appointmentDate >= today && (apt.status === 'scheduled' || apt.status === 'confirmed');
  });

  const unreadMessages = messages.filter(msg => msg.unreadCount > 0);
  const thisMonthAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(apt.appointmentDate);
    const today = new Date();
    return appointmentDate.getMonth() === today.getMonth() && 
           appointmentDate.getFullYear() === today.getFullYear();
  });

  const recentReports = reports.slice(0, 3);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'scheduled':
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ThemedDashboard role="patient">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-blue-100 animate-pulse">
          <Heart className="w-12 h-12" />
        </div>
        <div className="absolute top-40 right-40 text-green-100 animate-pulse" style={{ animationDelay: '1s' }}>
          <Activity className="w-8 h-8" />
        </div>
        <div className="absolute bottom-40 left-40 text-blue-100 animate-pulse" style={{ animationDelay: '2s' }}>
          <Shield className="w-10 h-10" />
        </div>
        <div className="absolute bottom-20 right-20 text-green-100 animate-pulse" style={{ animationDelay: '3s' }}>
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-full mr-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}! 🩺
              </h1>
              <p className="text-gray-600 mt-2">Your health journey continues here</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="medical-card hover:shadow-blue-500/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                <p className="text-2xl font-bold text-blue-600">{upcomingAppointments.length}</p>
              </div>
            </div>
          </div>
          
          <div className="medical-card hover:shadow-green-500/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-green-600">{reports.length}</p>
              </div>
            </div>
          </div>
          
          <div className="medical-card hover:shadow-purple-500/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-full">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-purple-600">{unreadMessages.length}</p>
              </div>
            </div>
          </div>
          
          <div className="medical-card hover:shadow-orange-500/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-full">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-orange-600">{thisMonthAppointments.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
                  <Link 
                    href="/book-appointment"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Book New
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {appointment.doctor?.name || 'Unknown Doctor'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {appointment.doctor?.specialization || 'General'}
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {appointment.reasonForVisit || appointment.type || 'Consultation'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming appointments</p>
                    <Link 
                      href="/book-appointment"
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Book your first appointment
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
                  <Link 
                    href="/my-reports"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {recentReports.length > 0 ? (
                  <div className="space-y-4">
                    {recentReports.map((report) => (
                      <div key={report._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {report.reportType || 'Medical Report'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              by {report.doctor?.name || 'Unknown Doctor'}
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <FileText className="h-4 w-4 mr-1" />
                              {new Date(report.createdAt).toLocaleDateString()} • {report.reportType}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {report.diagnosis || report.notes || 'No details available'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No reports available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{user?.name || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{user?.address || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Age & Gender</p>
                    <p className="font-medium">
                      {user?.age || 'N/A'} years, {user?.gender || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
              <Link 
                href="/patient-dashboard/profile"
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
                    href="/messages"
                    className="text-blue-600 hover:text-blue-500 font-medium text-sm"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.slice(0, 3).map((conversation) => (
                      <div key={conversation._id} className={`p-3 rounded-lg ${conversation.unreadCount > 0 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm text-gray-900">
                            {conversation.participantDetails?.find(p => p.role === 'doctor')?.name || 'Doctor'}
                          </p>
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessage?.timestamp ? 
                              new Date(conversation.lastMessage.timestamp).toLocaleDateString() : 
                              'No messages'
                            }
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-block mt-2 text-xs text-blue-600 font-medium">
                            {conversation.unreadCount} new message{conversation.unreadCount > 1 ? 's' : ''}
                          </span>
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
                  href="/book-appointment"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium inline-flex items-center justify-center"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Link>
                <Link 
                  href="/upload-report"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium inline-flex items-center justify-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Report
                </Link>
                <Link 
                  href="/messages"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium inline-flex items-center justify-center"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Doctor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
    </ThemedDashboard>
  );
}
