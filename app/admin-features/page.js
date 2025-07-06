'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { Zap, ToggleLeft, ToggleRight, Save, Settings, Shield, Bell, Mail, Video, CreditCard, Cloud, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminFeatures() {
  const [user, setUser] = useState(null);
  const [features, setFeatures] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    fetchFeatures();
  }, [router]);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/admin/features', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFeatures(data.features || {});
      }
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error('Failed to fetch features');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = (featureKey) => {
    setFeatures(prev => ({
      ...prev,
      [featureKey]: !prev[featureKey]
    }));
  };

  const saveFeatures = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/admin/features', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ features }),
      });

      if (response.ok) {
        toast.success('Features updated successfully');
      } else {
        toast.error('Failed to update features');
      }
    } catch (error) {
      console.error('Error saving features:', error);
      toast.error('Failed to save features');
    } finally {
      setSaving(false);
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

  const featureCategories = [
    {
      name: 'Authentication & Security',
      icon: Shield,
      features: [
        { key: 'registration', label: 'User Registration', description: 'Allow new users to register' },
        { key: 'twoFactor', label: 'Two-Factor Authentication', description: 'Enable 2FA for enhanced security' },
        { key: 'passwordReset', label: 'Password Reset', description: 'Allow users to reset their passwords' },
        { key: 'sessionTimeout', label: 'Session Timeout', description: 'Automatic session expiration' },
      ]
    },
    {
      name: 'Communication',
      icon: Mail,
      features: [
        { key: 'emailNotifications', label: 'Email Notifications', description: 'Send email notifications to users' },
        { key: 'smsNotifications', label: 'SMS Notifications', description: 'Send SMS notifications to users' },
        { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
        { key: 'chatMessaging', label: 'Chat Messaging', description: 'In-app messaging system' },
      ]
    },
    {
      name: 'Video & Telemedicine',
      icon: Video,
      features: [
        { key: 'videoConsultation', label: 'Video Consultation', description: 'Enable video calls between doctors and patients' },
        { key: 'screenSharing', label: 'Screen Sharing', description: 'Allow screen sharing during consultations' },
        { key: 'appointmentRecording', label: 'Appointment Recording', description: 'Record video consultations' },
        { key: 'waitingRoom', label: 'Virtual Waiting Room', description: 'Virtual waiting room for patients' },
      ]
    },
    {
      name: 'Payments & Billing',
      icon: CreditCard,
      features: [
        { key: 'onlinePayments', label: 'Online Payments', description: 'Accept online payments for appointments' },
        { key: 'subscriptions', label: 'Subscription Plans', description: 'Recurring subscription billing' },
        { key: 'invoiceGeneration', label: 'Invoice Generation', description: 'Automatically generate invoices' },
        { key: 'refundProcessing', label: 'Refund Processing', description: 'Process refunds automatically' },
      ]
    },
    {
      name: 'Data & Storage',
      icon: Cloud,
      features: [
        { key: 'dataBackup', label: 'Automatic Backups', description: 'Regular automated data backups' },
        { key: 'dataExport', label: 'Data Export', description: 'Export user data and reports' },
        { key: 'fileUpload', label: 'File Uploads', description: 'Allow users to upload files' },
        { key: 'cloudStorage', label: 'Cloud Storage', description: 'Store files in cloud storage' },
      ]
    },
    {
      name: 'Advanced Features',
      icon: Settings,
      features: [
        { key: 'aiDiagnosis', label: 'AI-Powered Diagnosis', description: 'AI assistance for medical diagnosis' },
        { key: 'mlRecommendations', label: 'ML Recommendations', description: 'Machine learning recommendations' },
        { key: 'analytics', label: 'Advanced Analytics', description: 'Detailed analytics and insights' },
        { key: 'apiAccess', label: 'API Access', description: 'Third-party API access' },
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar user={user} userRole="admin" onLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar user={user} userRole="admin" onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Feature Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Enable or disable system features and capabilities
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={saveFeatures}
              disabled={saving}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Feature Categories */}
        <div className="space-y-8">
          {featureCategories.map((category) => (
            <div key={category.name} className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <category.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="ml-3 text-lg leading-6 font-medium text-gray-900">
                    {category.name}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.features.map((feature) => (
                    <div key={feature.key} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{feature.label}</h4>
                        <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                      </div>
                      <button
                        onClick={() => toggleFeature(feature.key)}
                        className="ml-4 flex-shrink-0"
                      >
                        {features[feature.key] ? (
                          <ToggleRight className="h-8 w-8 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-8 w-8 text-gray-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
