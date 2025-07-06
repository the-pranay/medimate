'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Database,
  Server,
  Shield,
  Settings,
  RefreshCw,
  Bell,
  Search,
  Filter,
  Heart,
  Award,
  Zap,
  UserCheck,
  FileSearch,
  Cog
} from 'lucide-react';
import ThemedDashboard from '../ui/ThemedDashboard';
import DashboardNavbar from '../ui/DashboardNavbar';

export default function AdminDashboard() {
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  const fetchSystemStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/system/status');
      const data = await response.json();
      setSystemStatus(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch system status');
      console.error('Error fetching system status:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeDatabase = async () => {
    try {
      const response = await fetch('/api/system/status', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        fetchSystemStatus(); // Refresh status
      }
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading system status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchSystemStatus}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'working': return 'text-green-600 bg-green-100';
      case 'needs_setup': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'working': return <CheckCircle className="w-4 h-4" />;
      case 'needs_setup': return <Clock className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <ThemedDashboard role="admin">
      {/* Dashboard Navigation */}
      <DashboardNavbar 
        user={{ name: 'Admin', role: 'admin' }} 
        userRole="admin" 
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-purple-100 animate-pulse">
          <Shield className="w-12 h-12" />
        </div>
        <div className="absolute top-40 right-40 text-pink-100 animate-pulse" style={{ animationDelay: '1s' }}>
          <Settings className="w-8 h-8" />
        </div>
        <div className="absolute bottom-40 left-40 text-purple-100 animate-pulse" style={{ animationDelay: '2s' }}>
          <Database className="w-10 h-10" />
        </div>
        <div className="absolute bottom-20 right-20 text-pink-100 animate-pulse" style={{ animationDelay: '3s' }}>
          <Server className="w-6 h-6" />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full mr-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MediMate Admin Dashboard ⚙️
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchSystemStatus}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-md hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <Bell className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="medical-card hover:shadow-purple-500/20 transition-all duration-300">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-full">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Database Status</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {systemStatus?.success ? 'Connected' : 'Error'}
                  </p>
                </div>
              </div>
            </div>

            <div className="medical-card hover:shadow-green-500/20 transition-all duration-300">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-lg font-semibold text-green-600">
                    {systemStatus?.data?.database?.collections?.users || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="medical-card hover:shadow-yellow-500/20 transition-all duration-300">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Appointments</p>
                  <p className="text-lg font-semibold text-yellow-600">
                    {systemStatus?.data?.database?.collections?.appointments || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="medical-card hover:shadow-pink-500/20 transition-all duration-300">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-3 rounded-full">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Medical Records</p>
                  <p className="text-lg font-semibold text-pink-600">
                    {systemStatus?.data?.database?.collections?.medicalRecords || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">System Health</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Core Features</h4>
                  <div className="space-y-2">
                    {systemStatus?.data?.features?.core && Object.entries(systemStatus.data.features.core).map(([key, feature]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(feature.status)}
                          <span className="text-sm font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(feature.status)}`}>
                          {feature.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Optional Features</h4>
                  <div className="space-y-2">
                    {systemStatus?.data?.features?.optional && Object.entries(systemStatus.data.features.optional).map(([key, feature]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(feature.status)}
                          <span className="text-sm font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(feature.status)}`}>
                          {feature.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Database Quick Stats */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">Database Overview</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {systemStatus?.data?.database?.collections?.users || 0}
                  </div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {systemStatus?.data?.database?.collections?.appointments || 0}
                  </div>
                  <div className="text-sm text-gray-600">Appointments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {systemStatus?.data?.database?.collections?.medicalRecords || 0}
                  </div>
                  <div className="text-sm text-gray-600">Medical Records</div>
                </div>
              </div>
              
              {systemStatus?.data?.database?.collections?.users === 0 && (
                <div className="mt-6 text-center">
                  <p className="text-gray-600 mb-4">No data found in database. Initialize with sample data?</p>
                  <button
                    onClick={initializeDatabase}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Initialize Database
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mt-8">
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/admin-users" className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm">
                <UserCheck className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium text-gray-900">Manage Users</span>
              </Link>
              <Link href="/admin-doctors" className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all shadow-sm">
                <Heart className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Manage Doctors</span>
              </Link>
              <Link href="/admin-patients" className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all shadow-sm">
                <Users className="w-5 h-5 text-purple-600 mr-3" />
                <span className="font-medium text-gray-900">Manage Patients</span>
              </Link>
              <Link href="/admin-reports" className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg hover:from-yellow-100 hover:to-yellow-200 transition-all shadow-sm">
                <FileSearch className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="font-medium text-gray-900">View Reports</span>
              </Link>
              <Link href="/admin-database" className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg hover:from-indigo-100 hover:to-indigo-200 transition-all shadow-sm">
                <Database className="w-5 h-5 text-indigo-600 mr-3" />
                <span className="font-medium text-gray-900">Database</span>
              </Link>
              <Link href="/admin-features" className="flex items-center p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg hover:from-pink-100 hover:to-pink-200 transition-all shadow-sm">
                <Zap className="w-5 h-5 text-pink-600 mr-3" />
                <span className="font-medium text-gray-900">Features</span>
              </Link>
              <Link href="/admin-monitoring" className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all shadow-sm">
                <Activity className="w-5 h-5 text-orange-600 mr-3" />
                <span className="font-medium text-gray-900">Monitoring</span>
              </Link>
              <Link href="/admin-settings" className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all shadow-sm">
                <Cog className="w-5 h-5 text-gray-600 mr-3" />
                <span className="font-medium text-gray-900">Settings</span>
              </Link>
              <button
                onClick={fetchSystemStatus}
                className="flex items-center p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg hover:from-teal-100 hover:to-teal-200 transition-all shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-5 h-5 text-teal-600 mr-3" />
                <span className="font-medium text-gray-900">Refresh Status</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </ThemedDashboard>
  );
}
