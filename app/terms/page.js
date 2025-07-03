'use client';

import Link from 'next/link';
import { Shield, FileText, ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen">
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-600">
              Please read these terms carefully before using MediMate
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-blue max-w-none">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using MediMate, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">2. Medical Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                MediMate is a platform for connecting patients with healthcare providers. We do not provide medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">3. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                We take your privacy seriously and comply with all applicable healthcare privacy laws, including HIPAA. Your medical information is encrypted and securely stored.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">4. User Responsibilities</h2>
              <ul className="text-gray-700 mb-4 list-disc pl-6">
                <li>Provide accurate and truthful information</li>
                <li>Keep your login credentials secure</li>
                <li>Use the platform responsibly and ethically</li>
                <li>Respect other users and healthcare providers</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">5. Service Availability</h2>
              <p className="text-gray-700 mb-4">
                While we strive for 99.9% uptime, we cannot guarantee uninterrupted service. Emergency medical situations should always be handled through appropriate emergency services.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">6. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                MediMate's liability is limited to the maximum extent permitted by law. We are not responsible for any medical outcomes or decisions made based on information obtained through our platform.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">7. Modifications</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notifications.
              </p>

              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Questions about our Terms?</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      Contact our legal team at legal@medimate.com for clarification
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Link href="/register" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Registration
            </Link>
          </div>
        </div>
      </div>
      
      
    </div>
  );
}
