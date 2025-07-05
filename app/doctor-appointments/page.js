'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { Calendar, Clock, User, MapPin, Plus, Check, X, AlertCircle } from 'lucide-react';

export default function DoctorAppointments() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      const userData = localStorage.getItem('user');

      if (!token || userRole !== 'doctor') {
        router.push('/login');
        return;
      }

      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    checkAuth();
    loadAppointments();
  }, [router]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/appointments/doctor', {
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
    }
  };

  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      setActionLoading(appointmentId);
      
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: action === 'confirm' ? 'confirmed' : 'cancelled'
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Update the appointment in the local state
        setAppointments(prev => 
          prev.map(appointment => 
            appointment._id === appointmentId 
              ? { ...appointment, status: action === 'confirm' ? 'confirmed' : 'cancelled' }
              : appointment
          )
        );
        
        // Show success message
        const message = action === 'confirm' 
          ? 'Appointment confirmed successfully!' 
          : 'Appointment cancelled successfully!';
        
        toast.success(message);
      } else {
        throw new Error('Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment status. Please try again.');
    } finally {
      setActionLoading(null);
    }
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
        <DashboardNavbar user={user} userRole="doctor" onLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar user={user} userRole="doctor" onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-2">Manage your patient appointments</p>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
            <p className="text-gray-500">Your upcoming appointments will appear here</p>
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
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.patient?.name || 'Patient'}
                      </h3>
                      <p className="text-gray-600 mb-2">{appointment.reasonForVisit}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.appointmentTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : appointment.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>

                    {/* Action Buttons - Only show for pending appointments */}
                    {appointment.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAppointmentAction(appointment._id, 'confirm')}
                          disabled={actionLoading === appointment._id}
                          className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {actionLoading === appointment._id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          <span className="ml-1 text-sm">Confirm</span>
                        </button>
                        
                        <button
                          onClick={() => handleAppointmentAction(appointment._id, 'cancel')}
                          disabled={actionLoading === appointment._id}
                          className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {actionLoading === appointment._id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          <span className="ml-1 text-sm">Cancel</span>
                        </button>
                      </div>
                    )}

                    {/* Action Buttons - For confirmed appointments */}
                    {appointment.status === 'confirmed' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAppointmentAction(appointment._id, 'cancel')}
                          disabled={actionLoading === appointment._id}
                          className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {actionLoading === appointment._id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          <span className="ml-1 text-sm">Cancel</span>
                        </button>
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
