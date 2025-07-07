'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../../components/ui/DashboardNavbar';
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
      title: 'Security Features',
      icon: Shield,
      features: [
        { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Enable 2FA for all users' },
        { key: 'encryptionAtRest', label: 'Data Encryption at Rest', description: 'Encrypt all stored data' },
        { key: 'ssoIntegration', label: 'SSO Integration', description: 'Single Sign-On support' },
        { key: 'auditLogs', label: 'Audit Logs', description: 'Comprehensive activity logging' },
      ]
    },
    {
      title: 'Communication Features',
      icon: Mail,
      features: [
        { key: 'emailNotifications', label: 'Email Notifications', description: 'Send email alerts to users' },
        { key: 'smsNotifications', label: 'SMS Notifications', description: 'Send SMS alerts to users' },
        { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
        { key: 'inAppMessaging', label: 'In-App Messaging', description: 'Direct messaging between users' },
      ]
    },
    {
      title: 'Video & Telemedicine',
      icon: Video,
      features: [
        { key: 'videoConsultation', label: 'Video Consultation', description: 'Enable video calls between doctors and patients' },
        { key: 'screenSharing', label: 'Screen Sharing', description: 'Share screens during video calls' },
        { key: 'recordConsultation', label: 'Record Consultation', description: 'Record video consultations for later review' },
        { key: 'virtualWaitingRoom', label: 'Virtual Waiting Room', description: 'Pre-consultation waiting area' },
      ]
    },
    {
      title: 'Payment & Billing',
      icon: CreditCard,
      features: [
        { key: 'onlinePayments', label: 'Online Payments', description: 'Accept payments through the platform' },
        { key: 'insuranceIntegration', label: 'Insurance Integration', description: 'Connect with insurance providers' },
        { key: 'autoInvoicing', label: 'Automatic Invoicing', description: 'Generate invoices automatically' },
        { key: 'subscriptionBilling', label: 'Subscription Billing', description: 'Handle recurring payments' },
      ]
    },
    {
      title: 'Advanced Features',
      icon: Cloud,
      features: [
        { key: 'aiDiagnostics', label: 'AI Diagnostics', description: 'AI-powered diagnostic assistance' },
        { key: 'cloudBackup', label: 'Cloud Backup', description: 'Automatic cloud data backup' },
        { key: 'apiAccess', label: 'API Access', description: 'Third-party API integration' },
        { key: 'mobileApp', label: 'Mobile App', description: 'Mobile application support' },
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar user={user} onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="h-8 w-8 text-blue-600" />
                Feature Management
              </h1>
              <p className="text-gray-600 mt-2">Configure and manage platform features</p>
            </div>
            <button
              onClick={saveFeatures}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {featureCategories.map((category) => (
            <div key={category.title} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <category.icon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.features.map((feature) => (
                    <div key={feature.key} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{feature.label}</h3>
                          <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
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
