'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import { 
  User, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Stethoscope,
  FileText,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { renderLoaderByPageType } from '../../../utils/loaders';
import toast from 'react-hot-toast';
import { DoctorStatusBadge } from '../../../components/ui/DoctorStatusBadge';

export default function AdminDoctorVerification() {
  const [user, setUser] = useState(null);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [processedDoctors, setProcessedDoctors] = useState(new Set()); // Track processed doctors
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      const userData = localStorage.getItem('user');

      if (!token || userRole !== 'admin') {
        router.push('/login');
        return;
      }

      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    checkAuth();
    loadPendingDoctors();
  }, [router]);

  const loadPendingDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/admin/doctors/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPendingDoctors(data.data || []);
        // Reset processed doctors when loading fresh data
        setProcessedDoctors(new Set());
      } else {
        throw new Error('Failed to load pending doctors');
      }
    } catch (error) {
      console.error('Error loading pending doctors:', error);
      toast.error('Failed to load pending doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorAction = async (doctorId, action, reason = '') => {
    try {
      setActionLoading(doctorId);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch(`/api/admin/doctors/${doctorId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action,
          rejectionReason: reason
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Show success message
        if (action === 'approve') {
          toast.success(`Doctor approved and verified successfully!`);
        } else {
          toast.success(`Doctor rejected successfully!`);
        }
        
        // Update the doctor's status in the pendingDoctors array
        setPendingDoctors(prev => prev.map(doc => {
          if (doc._id === doctorId) {
            return {
              ...doc,
              isVerified: action === 'approve',
              verifiedAt: action === 'approve' ? new Date().toISOString() : null,
              rejectedAt: action === 'reject' ? new Date().toISOString() : null,
              rejectionReason: action === 'reject' ? reason : null,
              isActive: action === 'approve' ? true : false
            };
          }
          return doc;
        }));
        
        // Add to processed doctors set with action type
        setProcessedDoctors(prev => new Set([...prev, `${doctorId}_${action}`]));
        
        // Close rejection modal if open
        setShowRejectModal(null);
        setRejectionReason('');
        
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update doctor status' }));
        throw new Error(errorData.message || 'Failed to update doctor status');
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      toast.error(`Failed to ${action} doctor: ${error.message}`);
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
    return renderLoaderByPageType('admin', <DashboardNavbar user={user} userRole="admin" onLogout={handleLogout} />);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar user={user} userRole="admin" onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Doctor Verification</h1>
              <p className="text-gray-600 mt-2">Review and verify pending doctor registrations</p>
            </div>
            <button
              onClick={loadPendingDoctors}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {pendingDoctors.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-500">No pending doctor verifications at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingDoctors.map((doctor) => (
              <div key={doctor._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {doctor.name.startsWith('Dr. ') ? doctor.name : `Dr. ${doctor.name}`}
                      </h3>
                      <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <span className="ml-2 text-gray-900">{doctor.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Phone:</span>
                          <span className="ml-2 text-gray-900">{doctor.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">License Number:</span>
                          <span className="ml-2 text-gray-900 font-mono">{doctor.licenseNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Experience:</span>
                          <span className="ml-2 text-gray-900">{doctor.experience} years</span>
                        </div>
                        {doctor.address && (
                          <div className="md:col-span-2">
                            <span className="text-gray-500">Address:</span>
                            <span className="ml-2 text-gray-900">{doctor.address}</span>
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <span className="text-gray-500">Registered:</span>
                          <span className="ml-2 text-gray-900">
                            {new Date(doctor.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      {doctor.consultationFee && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Consultation Fee:</strong> ₹{doctor.consultationFee}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <DoctorStatusBadge doctor={doctor} size="sm" />
                  </div>
                </div>
                
                <div className="mt-6 flex items-center space-x-3">
                  {doctor.isVerified || doctor.rejectedAt ? (
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Processed</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        This doctor has been {doctor.isVerified ? 'approved' : 'rejected'} and no further action is needed.
                      </p>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleDoctorAction(doctor._id, 'approve')}
                        disabled={actionLoading === doctor._id}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {actionLoading === doctor._id ? 'Processing...' : 'Approve'}
                      </button>
                      
                      <button
                        onClick={() => setShowRejectModal(doctor._id)}
                        disabled={actionLoading === doctor._id}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                    </>
                  )}
                  
                  <div className="flex items-center text-gray-500 text-sm">
                    <FileText className="w-4 h-4 mr-1" />
                    Verify license number: {doctor.licenseNumber}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Doctor Application</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection (optional)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason for rejection..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleDoctorAction(showRejectModal, 'reject', rejectionReason)}
                  disabled={actionLoading}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {actionLoading ? 'Processing...' : 'Confirm Rejection'}
                </button>
                
                <button
                  onClick={() => {
                    setShowRejectModal(null);
                    setRejectionReason('');
                  }}
                  disabled={actionLoading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
