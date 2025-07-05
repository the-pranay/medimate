'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  ArrowLeft,
  Calendar,
  User,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

export default function MyReports() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reportTypes = ['All Types', 'Lab Report', 'Test Report', 'Imaging', 'Prescription'];
  const statusOptions = ['All Status', 'reviewed', 'pending'];

  useEffect(() => {
    // Check if user is logged in
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      router.push('/login');
      return;
    }

    // Fetch reports from database
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const response = await fetch('/api/medical-records/reports', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        
        const data = await response.json();
        if (data.success) {
          setReports(data.data || []);
        } else {
          throw new Error(data.error || 'Failed to fetch reports');
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [router]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'reviewed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Lab Report':
        return '🧪';
      case 'Test Report':
        return '📋';
      case 'Imaging':
        return '🔬';
      case 'Prescription':
        return '💊';
      default:
        return '📄';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || selectedType === 'All Types' || report.type === selectedType;
    const matchesStatus = selectedStatus === '' || selectedStatus === 'All Status' || report.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Here you would typically upload the file to your server
      console.log('Uploading file:', file);
      // For demo, we'll just add a new report to the list
      const newReport = {
        id: reports.length + 1,
        title: file.name.replace(/\.[^/.]+$/, ""),
        doctor: 'Self Uploaded',
        date: new Date().toISOString().split('T')[0],
        type: 'Lab Report',
        status: 'pending',
        fileUrl: '#',
        notes: null,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
      };
      setReports(prev => [newReport, ...prev]);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
            <p className="text-gray-600 mt-2">Manage your medical reports and documents</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center cursor-pointer">
              <Upload className="h-5 w-5 mr-2" />
              Upload Report
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">Error loading reports</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content - only show when not loading */}
        {!loading && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Reviewed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reports.filter(r => r.status === 'reviewed').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reports.filter(r => r.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Filters and Reports - only show when not loading */}
        {!loading && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {reportTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow-sm border">
          {sortedReports.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {sortedReports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getTypeIcon(report.type)}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{report.title}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {report.doctor}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(report.date).toLocaleDateString()}
                            </div>
                            <span>•</span>
                            <span>{report.size}</span>
                          </div>
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">{report.type}</span>
                          </div>
                          {report.notes && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                              <strong>Doctor's Notes:</strong> {report.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg">
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No reports found matching your criteria</p>
              {searchTerm || selectedType !== '' || selectedStatus !== '' ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('');
                    setSelectedStatus('');
                  }}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Clear filters
                </button>
              ) : (
                <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center cursor-pointer">
                  <Plus className="h-5 w-5 mr-2" />
                  Upload your first report
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>
          )}
        </div>

        {/* Upload Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Upload Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Supported formats: PDF, JPG, JPEG, PNG</li>
            <li>• Maximum file size: 10MB</li>
            <li>• Ensure all text is clearly readable</li>
            <li>• Include patient name and date on reports</li>
            <li>• Reports will be reviewed by your assigned doctor</li>
          </ul>
        </div>
        </div>
        )}
      </div>
    </div>
    
    <Footer />
  </div>
  );
}
