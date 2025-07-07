'use client';

import React from 'react';
import {
  PageLoader,
  HeartbeatLoader,
  MedicalDashboardLoader,
  StethoscopeLoader,
  AppointmentLoader,
  MedicalReportLoader,
  MedicalSpinnerLoader,
  ButtonLoader
} from '../components/ui/HealthcareLoaders';

/**
 * Renders a full page loading component with the specified loader type
 */
export const renderPageLoader = ({
  type = 'dashboard',
  text = 'Loading...',
  navbar = null,
  fullScreen = false
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {navbar}
      <div className="flex items-center justify-center min-h-screen">
        <PageLoader
          type={type}
          size="lg"
          color="primary"
          text={text}
          fullScreen={fullScreen}
        />
      </div>
    </div>
  );
};

/**
 * Renders a button loading indicator
 */
export const renderButtonLoader = ({
  color = 'white',
  size = 'xs'
}) => {
  return <ButtonLoader color={color} size={size} />;
};

/**
 * Maps different page types to appropriate loader types and text
 */
export const getLoaderConfig = (pageType) => {
  const configs = {
    dashboard: {
      type: 'dashboard',
      text: 'Loading your dashboard...'
    },
    admin: {
      type: 'dashboard',
      text: 'Loading admin dashboard...'
    },
    appointments: {
      type: 'appointment',
      text: 'Loading your appointments...'
    },
    doctors: {
      type: 'stethoscope',
      text: 'Loading doctors data...'
    },
    patients: {
      type: 'dashboard',
      text: 'Loading patient data...'
    },
    reports: {
      type: 'report',
      text: 'Loading medical reports...'
    },
    profile: {
      type: 'heartbeat',
      text: 'Loading your profile...'
    },
    settings: {
      type: 'dashboard',
      text: 'Loading settings...'
    },
    messages: {
      type: 'dashboard',
      text: 'Loading conversations...'
    },
    database: {
      type: 'dashboard',
      text: 'Loading database information...'
    },
    features: {
      type: 'dashboard',
      text: 'Loading system features...'
    },
    monitoring: {
      type: 'heartbeat',
      text: 'Loading system monitoring data...'
    }
  };

  return configs[pageType] || configs.dashboard;
};

/**
 * Convenience function to render a page loader based on page type
 */
export const renderLoaderByPageType = (pageType, navbar = null) => {
  const config = getLoaderConfig(pageType);
  return renderPageLoader({
    type: config.type,
    text: config.text,
    navbar,
    fullScreen: false
  });
};

export default {
  renderPageLoader,
  renderButtonLoader,
  getLoaderConfig,
  renderLoaderByPageType
};
