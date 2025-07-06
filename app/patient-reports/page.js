'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { FileText, Download, Eye, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientReports() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
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
    loadReports();
  }, [router]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/medical-records/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.data || []);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
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

  const handleViewReport = (report) => {
    if (report.files && report.files.length > 0) {
      // Open the first file in a new tab
      const fileUrl = report.files[0].fileUrl;
      window.open(fileUrl, '_blank');
      toast.success('Opening report...');
    } else {
      toast.error('No file available for this report');
    }
  };

  const handleDownloadReport = (report) => {
    if (report.files && report.files.length > 0) {
      const fileUrl = report.files[0].fileUrl;
      const fileName = report.files[0].fileName || `Report_${report.title}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started...');
    } else {
      toast.error('No file available for download');
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
          <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
          <p className="text-gray-600 mt-2">View and download your medical reports</p>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports available</h3>
            <p className="text-gray-500">Your medical reports will appear here when available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reports.map((report) => (
              <div key={report._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                      <p className="text-gray-600">{report.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>
                            {report.doctor?.name?.startsWith('Dr. ') ? report.doctor.name : `Dr. ${report.doctor?.name || 'Doctor'}`}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewReport(report)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="View Report"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDownloadReport(report)}
                      className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                      title="Download Report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
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
