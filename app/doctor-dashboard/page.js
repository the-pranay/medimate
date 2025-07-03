'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Shield
} from 'lucide-react';
import ThemedDashboard from '../components/ui/ThemedDashboard';

export default function DoctorDashboard() {
  const router = useRouter();
  const [doctor, setDoctor] = useState({
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@medimate.com',
    phone: '+91 9876543210',
    specialization: 'Cardiologist',
    experience: 8,
    licenseNumber: 'MH12345',
    rating: 4.8,
    totalPatients: 156
  });

  const [todayAppointments, setTodayAppointments] = useState([
    {
      id: 1,
      patient: 'John Doe',
      time: '10:30 AM',
      type: 'Regular Checkup',
      status: 'confirmed',
      phone: '+91 9876543210',
      age: 29,
      gender: 'Male'
    },
    {
      id: 2,
      patient: 'Jane Smith',
      time: '11:00 AM',
      type: 'Follow-up',
      status: 'confirmed',
      phone: '+91 9876543211',
      age: 34,
      gender: 'Female'
    },
    {
      id: 3,
      patient: 'Mike Johnson',
      time: '2:00 PM',
      type: 'Consultation',
      status: 'pending',
      phone: '+91 9876543212',
      age: 45,
      gender: 'Male'
    },
    {
      id: 4,
      patient: 'Lisa Brown',
      time: '3:30 PM',
      type: 'Regular Checkup',
      status: 'pending',
      phone: '+91 9876543213',
      age: 28,
      gender: 'Female'
    }
  ]);

  const [pendingReports, setPendingReports] = useState([
    {
      id: 1,
      patient: 'John Doe',
      type: 'Blood Test Report',
      uploadedDate: '2025-06-25',
      status: 'pending_review'
    },
    {
      id: 2,
      patient: 'Jane Smith',
      type: 'ECG Report',
      uploadedDate: '2025-06-24',
      status: 'pending_review'
    }
  ]);

  const [recentMessages, setRecentMessages] = useState([
    {
      id: 1,
      patient: 'John Doe',
      message: 'Doctor, I have some questions about my medication.',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      patient: 'Jane Smith',
      message: 'Thank you for the prescription. Feeling much better!',
      time: '1 day ago',
      unread: false
    }
  ]);

  const [stats, setStats] = useState({
    todayAppointments: 4,
    completedToday: 1,
    pendingReports: 2,
    totalPatients: 156,
    monthlyAppointments: 67,
    rating: 4.8
  });

  useEffect(() => {
    // Check if user is logged in as doctor
    const userRole = localStorage.getItem('userRole');
    if (!userRole || userRole !== 'doctor') {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/');
  };

  const handleAppointmentAction = (appointmentId, action) => {
    setTodayAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: action === 'approve' ? 'confirmed' : 'cancelled' }
          : apt
      )
    );
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

  return (
    <ThemedDashboard role="doctor">
      
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
                Good morning, {doctor.name.split(' ')[1]}! 👨‍⚕️
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
                <p className="text-2xl font-bold text-green-600">{stats.todayAppointments}</p>
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
                <p className="text-2xl font-bold text-teal-600">{stats.totalPatients}</p>
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
                <p className="text-2xl font-bold text-purple-600">{stats.pendingReports}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
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
                      <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{appointment.patient}</h3>
                                <p className="text-sm text-gray-600">{appointment.age} years, {appointment.gender}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {appointment.time}
                              </div>
                              <span>•</span>
                              <span>{appointment.type}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                            {appointment.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleAppointmentAction(appointment.id, 'approve')}
                                  className="p-1 text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleAppointmentAction(appointment.id, 'decline')}
                                  className="p-1 text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </div>
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
                    href="/patient-reports"
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
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
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
                <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                <p className="text-sm text-gray-600">{doctor.specialization}</p>
                <div className="flex items-center justify-center mt-2">
                  <Award className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{doctor.rating}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{doctor.experience} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">License</span>
                  <span className="font-medium">{doctor.licenseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Patients</span>
                  <span className="font-medium">{doctor.totalPatients}</span>
                </div>
              </div>
              <Link 
                href="/doctor-dashboard/profile"
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
                  href="/manage-appointments"
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
                  href="/patient-reports"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium inline-flex items-center justify-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Review Reports
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
                  <span className="font-semibold text-gray-900">{stats.monthlyAppointments}</span>
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
