'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { Calendar, Clock, User, MapPin, Plus, RefreshCw } from 'lucide-react';

export default function PatientAppointments() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      const userData = localStorage.getItem('user');

      if (!token || userRole !== 'patient') {
        router.push('/login');
        return;
      }

      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    checkAuth();
    loadAppointments();
    
    // Auto-refresh every 5 seconds to get updated status in real-time
    const interval = setInterval(() => {
      loadAppointments(true); // Show refreshing indicator
    }, 5000);
    
    return () => clearInterval(interval);
  }, [router]);

  const loadAppointments = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/appointments/patient', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.data || []);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadAppointments(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar user={user} userRole="patient" onLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar user={user} userRole="patient" onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600 mt-2">View and manage your appointments</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => router.push('/book-appointment')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
            <p className="text-gray-500 mb-4">Book your first appointment with a doctor</p>
            <button
              onClick={() => router.push('/book-appointment')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Book Appointment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.doctor?.name?.startsWith('Dr. ') ? appointment.doctor.name : `Dr. ${appointment.doctor?.name || 'Doctor'}`}
                      </h3>
                      <p className="text-gray-600">{appointment.doctor?.specialization}</p>
                      <p className="text-sm text-gray-500 mt-1">{appointment.reasonForVisit}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.appointmentTime}</span>
                        </div>
                        {appointment.payment?.status === 'paid' && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <span>💳</span>
                            <span>₹{appointment.payment.amount} Paid</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Payment Information */}
                      {appointment.payment?.status === 'paid' && (
                        <div className="mt-2 p-2 bg-green-50 rounded-md">
                          <p className="text-sm text-green-800">
                            <strong>Payment Confirmed:</strong> ₹{appointment.payment.amount} paid on {new Date(appointment.payment.paidAt).toLocaleDateString()}
                          </p>
                          {appointment.status === 'paid' && (
                            <p className="text-sm text-blue-600 mt-1">
                              ⏳ Awaiting doctor confirmation
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : appointment.status === 'paid'
                        ? 'bg-blue-100 text-blue-800'
                        : appointment.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : appointment.status === 'completed'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status === 'paid' ? 'Payment Confirmed' : appointment.status}
                    </span>
                    
                    {/* Status indicator */}
                    {appointment.status === 'confirmed' && (
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                        <span className="text-sm">Confirmed by doctor</span>
                      </div>
                    )}
                    
                    {appointment.status === 'paid' && (
                      <div className="flex items-center text-blue-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                        <span className="text-sm">Awaiting doctor confirmation</span>
                      </div>
                    )}
                    
                    {appointment.status === 'cancelled' && (
                      <div className="flex items-center text-red-600">
                        <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                        <span className="text-sm">Cancelled</span>
                      </div>
                    )}
                    
                    {appointment.status === 'pending' && (
                      <div className="flex items-center text-yellow-600">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
                        <span className="text-sm">Awaiting confirmation</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
