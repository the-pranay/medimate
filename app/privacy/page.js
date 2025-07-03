'use client';

import Link from 'next/link';
import { Shield, Lock, Eye, ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen">
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600">
              Your privacy and data security are our top priorities
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-green max-w-none">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information necessary to provide healthcare services:
              </p>
              <ul className="text-gray-700 mb-4 list-disc pl-6">
                <li>Personal information (name, email, phone number)</li>
                <li>Medical history and health records</li>
                <li>Appointment and consultation data</li>
                <li>Communication with healthcare providers</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">2. How We Use Your Information</h2>
              <ul className="text-gray-700 mb-4 list-disc pl-6">
                <li>Facilitate medical consultations and appointments</li>
                <li>Maintain your health records securely</li>
                <li>Improve our services and user experience</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">3. HIPAA Compliance</h2>
              <p className="text-gray-700 mb-4">
                MediMate is fully compliant with the Health Insurance Portability and Accountability Act (HIPAA). We implement appropriate safeguards to protect your health information:
              </p>
              <ul className="text-gray-700 mb-4 list-disc pl-6">
                <li>End-to-end encryption for all medical data</li>
                <li>Secure data transmission protocols</li>
                <li>Regular security audits and updates</li>
                <li>Strict access controls for healthcare providers</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">4. Data Sharing</h2>
              <p className="text-gray-700 mb-4">
                We only share your information:
              </p>
              <ul className="text-gray-700 mb-4 list-disc pl-6">
                <li>With your chosen healthcare providers</li>
                <li>When required by law or court order</li>
                <li>In emergency situations to protect your health</li>
                <li>With your explicit consent for specific purposes</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">5. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We employ industry-leading security measures:
              </p>
              <ul className="text-gray-700 mb-4 list-disc pl-6">
                <li>256-bit SSL encryption</li>
                <li>Multi-factor authentication</li>
                <li>Regular security assessments</li>
                <li>Secure cloud infrastructure</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="text-gray-700 mb-4 list-disc pl-6">
                <li>Access your personal health information</li>
                <li>Request corrections to your data</li>
                <li>Request deletion of your account</li>
                <li>Export your medical records</li>
              </ul>

              <div className="mt-8 p-6 bg-green-50 rounded-xl">
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-green-900">Privacy Questions?</h3>
                    <p className="text-green-700 text-sm mt-1">
                      Contact our privacy officer at privacy@medimate.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Link href="/register" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Registration
            </Link>
          </div>
        </div>
      </div>
      
      
    </div>
  );
}
