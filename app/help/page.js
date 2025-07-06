'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  FileText, 
  Video,
  Users,
  Settings,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Help() {
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState('general');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
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
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  const faqCategories = [
    { id: 'general', label: 'General', icon: HelpCircle },
    { id: 'appointments', label: 'Appointments', icon: Clock },
    { id: 'payments', label: 'Payments', icon: FileText },
    { id: 'technical', label: 'Technical', icon: Settings },
  ];

  const faqs = {
    general: [
      {
        question: 'How do I update my profile information?',
        answer: 'Go to your dashboard and click on "Profile" in the navigation menu. You can update your personal information, contact details, and upload a profile photo.'
      },
      {
        question: 'How do I change my password?',
        answer: 'Navigate to Settings from your dashboard and select "Change Password". Enter your current password and your new password.'
      },
      {
        question: 'How do I contact support?',
        answer: 'You can contact our support team via email at support@medimate.com or call us at +1-800-MEDIMATE. Our support hours are Monday to Friday, 9 AM to 6 PM.'
      }
    ],
    appointments: [
      {
        question: 'How do I book an appointment?',
        answer: 'Click on "Book Appointment" from your dashboard, select your preferred doctor, choose an available time slot, and confirm your booking.'
      },
      {
        question: 'Can I reschedule my appointment?',
        answer: 'Yes, you can reschedule your appointment up to 24 hours before the scheduled time. Go to "Manage Appointments" and select the appointment you want to reschedule.'
      },
      {
        question: 'How do I cancel an appointment?',
        answer: 'To cancel an appointment, go to "Manage Appointments", find your appointment, and click the cancel button. Please note our cancellation policy.'
      }
    ],
    payments: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, and digital wallets through our secure payment gateway powered by Razorpay.'
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard encryption and secure payment processing through Razorpay. Your payment information is never stored on our servers.'
      },
      {
        question: 'How do I get a receipt for my payment?',
        answer: 'After successful payment, you will receive an email receipt. You can also download receipts from your dashboard under "Payment History".'
      }
    ],
    technical: [
      {
        question: 'What browsers are supported?',
        answer: 'MediMate works best on modern browsers including Chrome, Firefox, Safari, and Edge. Make sure your browser is updated to the latest version.'
      },
      {
        question: 'I am having trouble logging in. What should I do?',
        answer: 'Make sure you are using the correct email and password. If you forgot your password, click "Forgot Password" on the login page. Clear your browser cache if the issue persists.'
      },
      {
        question: 'The video call is not working. How do I fix it?',
        answer: 'Ensure you have granted camera and microphone permissions to your browser. Check your internet connection and try refreshing the page. Use a supported browser for the best experience.'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar user={user} userRole={user?.role || 'patient'} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-2">Find answers to common questions and get support</p>
        </div>

        {/* Contact Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Call Support</h3>
                <p className="text-sm text-gray-600">Mon-Fri 9 AM - 6 PM</p>
              </div>
            </div>
            <p className="text-blue-600 font-medium">+1-800-MEDIMATE</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email Support</h3>
                <p className="text-sm text-gray-600">We respond within 24 hours</p>
              </div>
            </div>
            <p className="text-green-600 font-medium">support@medimate.com</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Live Chat</h3>
                <p className="text-sm text-gray-600">Available 24/7</p>
              </div>
            </div>
            <button 
              onClick={() => {
                toast.info('Live chat feature coming soon!');
              }}
              className="text-purple-600 font-medium hover:text-purple-800"
            >
              Start Chat
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="flex">
            {/* Category Sidebar */}
            <div className="w-64 border-r border-gray-200 p-4">
              <nav className="space-y-2">
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span>{category.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* FAQ Content */}
            <div className="flex-1 p-6">
              <div className="space-y-4">
                {faqs[activeCategory].map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button 
                      onClick={() => {
                        // Toggle FAQ expand/collapse functionality
                        toast.info('FAQ expand/collapse functionality - Coming soon!');
                      }}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <h3 className="font-medium text-gray-900">{faq.question}</h3>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                    <div className="px-4 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Video Tutorials</h3>
                <p className="text-sm text-gray-600">Learn how to use MediMate</p>
              </div>
            </div>
            <button 
              onClick={() => {
                toast.info('Video tutorials coming soon!');
              }}
              className="text-blue-600 font-medium hover:text-blue-800"
            >
              Watch Tutorials
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Community Forum</h3>
                <p className="text-sm text-gray-600">Connect with other users</p>
              </div>
            </div>
            <button 
              onClick={() => {
                toast.info('Community forum coming soon!');
              }}
              className="text-green-600 font-medium hover:text-green-800"
            >
              Join Forum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
