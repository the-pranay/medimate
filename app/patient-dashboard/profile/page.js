'use client';

import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import ProfileEdit from '../../components/ui/ProfileEdit';

const PatientProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Profile</h1>
          <p className="text-gray-600">Manage your personal information and medical details</p>
        </div>
        
        <ProfileEdit userRole="patient" />
      </div>
    </div>
  );
};

export default PatientProfilePage;
