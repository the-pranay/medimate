'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { FileText, Download, Calendar, User, Plus, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Prescriptions() {
  const [user, setUser] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      const userData = localStorage.getItem('user');

      if (!token) {
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
      // Mock data for now - replace with actual API call
      const mockPrescriptions = [
        {
          _id: '1',
          patientName: 'John Doe',
          doctorName: 'Dr. Smith',
          date: '2024-01-15',
          medications: [
            { name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily', duration: '7 days' },
            { name: 'Paracetamol', dosage: '650mg', frequency: 'As needed', duration: '5 days' }
          ],
          diagnosis: 'Upper respiratory infection',
          status: 'active'
        },
        {
          _id: '2',
          patientName: 'Jane Smith',
          doctorName: 'Dr. Johnson',
          date: '2024-01-10',
          medications: [
            { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' }
          ],
          diagnosis: 'Hypertension',
          status: 'completed'
        }
      ];
      setPrescriptions(mockPrescriptions);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar user={user} userRole={user?.role || 'patient'} onLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar user={user} userRole={user?.role || 'patient'} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
            <p className="text-gray-600 mt-2">Manage and view prescriptions</p>
          </div>
          {user?.role === 'doctor' && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Prescription</span>
            </button>
          )}
        </div>

        {prescriptions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
            <p className="text-gray-500">Your prescriptions will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {prescriptions.map((prescription) => (
              <div key={prescription._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user?.role === 'doctor' ? prescription.patientName : prescription.doctorName}
                      </h3>
                      <p className="text-gray-600">{prescription.diagnosis}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(prescription.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      prescription.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {prescription.status}
                    </span>
                    <button 
                      onClick={() => {
                        // Download prescription functionality
                        toast.info('Download prescription functionality - Coming soon!');
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    {user?.role === 'doctor' && (
                      <button 
                        onClick={() => {
                          // Edit prescription functionality
                          toast.info('Edit prescription functionality - Coming soon!');
                        }}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Medications:</h4>
                  <div className="space-y-2">
                    {prescription.medications.map((medication, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{medication.name}</p>
                            <p className="text-sm text-gray-600">{medication.dosage} - {medication.frequency}</p>
                          </div>
                          <span className="text-sm text-gray-500">{medication.duration}</span>
                        </div>
                      </div>
                    ))}
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
