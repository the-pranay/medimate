'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { FileText, Calendar, User, Pill, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientPrescriptions() {
  const [user, setUser] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed, expired
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
    loadPrescriptions();
  }, [router]);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/prescriptions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data.data || []);
      } else {
        toast.error('Failed to load prescriptions');
      }
    } catch (error) {
      console.error('Error loading prescriptions:', error);
      toast.error('Error loading prescriptions');
    } finally {
      setLoading(false);
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

  const filteredPrescriptions = prescriptions.filter(prescription => {
    if (filter === 'all') return true;
    return prescription.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'completed':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Prescriptions</h1>
          <p className="text-gray-600 mt-2">View and manage your medical prescriptions</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Prescriptions', count: prescriptions.length },
                { key: 'active', label: 'Active', count: prescriptions.filter(p => p.status === 'active').length },
                { key: 'completed', label: 'Completed', count: prescriptions.filter(p => p.status === 'completed').length },
                { key: 'expired', label: 'Expired', count: prescriptions.filter(p => p.status === 'expired').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {filteredPrescriptions.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'Your medical prescriptions will appear here when prescribed by your doctor'
                : `No ${filter} prescriptions found`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPrescriptions.map((prescription) => (
              <div key={prescription._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Pill className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{prescription.title}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Dr. {prescription.doctor?.name || 'Unknown Doctor'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(prescription.prescriptionDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(prescription.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                      {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Diagnosis</h4>
                    <p className="text-sm text-gray-700">{prescription.diagnosis}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Duration</h4>
                    <p className="text-sm text-gray-700">{prescription.duration || 'Not specified'}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Prescribed Medicines</h4>
                  <div className="space-y-2">
                    {prescription.medicines.map((medicine, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">{medicine.name}</h5>
                            <p className="text-sm text-gray-600">{medicine.dosage}</p>
                            <p className="text-sm text-gray-500">{medicine.frequency}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">Qty: {medicine.quantity}</p>
                            {medicine.instructions && (
                              <p className="text-xs text-gray-500 mt-1">{medicine.instructions}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {prescription.notes && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Doctor's Notes</h4>
                    <p className="text-sm text-gray-700">{prescription.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
