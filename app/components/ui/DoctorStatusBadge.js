'use client';

import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

/**
 * Doctor Status Badge Component
 * Displays the verification status of a doctor with appropriate styling
 */
export const DoctorStatusBadge = ({ doctor, size = 'sm' }) => {
  const getStatusConfig = () => {
    if (!doctor.isActive && doctor.isVerified === false && doctor.rejectedAt) {
      return {
        icon: XCircle,
        text: 'Rejected',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        iconColor: 'text-red-500'
      };
    }
    
    if (doctor.isVerified) {
      return {
        icon: CheckCircle,
        text: 'Verified',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        iconColor: 'text-green-500'
      };
    }
    
    if (!doctor.isVerified && !doctor.rejectedAt) {
      return {
        icon: Clock,
        text: 'Pending',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        iconColor: 'text-yellow-500'
      };
    }
    
    // Default case
    return {
      icon: AlertCircle,
      text: 'Unknown',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      iconColor: 'text-gray-500'
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2 text-lg'
  };
  
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`inline-flex items-center rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses[size]}`}>
      <Icon className={`mr-1 ${iconSizes[size]} ${config.iconColor}`} />
      <span>{config.text}</span>
    </div>
  );
};

/**
 * Simple Status Text Component
 * For use in places where only text status is needed
 */
export const DoctorStatusText = ({ doctor }) => {
  if (!doctor.isActive && doctor.isVerified === false && doctor.rejectedAt) {
    return <span className="text-red-600 font-medium">Rejected</span>;
  }
  
  if (doctor.isVerified) {
    return <span className="text-green-600 font-medium">Verified</span>;
  }
  
  if (!doctor.isVerified && !doctor.rejectedAt) {
    return <span className="text-yellow-600 font-medium">Pending</span>;
  }
  
  return <span className="text-gray-600 font-medium">Unknown</span>;
};

export default DoctorStatusBadge;
