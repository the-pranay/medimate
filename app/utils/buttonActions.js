// Enhanced button functionality and real-time actions for MediMate
'use client';

import toast from 'react-hot-toast';
import { realTimeUpdates } from './realTimeUpdates';

export class ButtonActions {
  constructor() {
    this.isProcessing = new Map();
  }

  // Generic action with loading state
  async executeAction(actionId, actionFunction, loadingMessage = 'Processing...') {
    if (this.isProcessing.get(actionId)) {
      toast.error('Action already in progress');
      return;
    }

    this.isProcessing.set(actionId, true);
    const loadingToast = toast.loading(loadingMessage);

    try {
      const result = await actionFunction();
      toast.dismiss(loadingToast);
      return result;
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Action failed');
      throw error;
    } finally {
      this.isProcessing.delete(actionId);
    }
  }

  // Appointment Actions
  async bookAppointment(appointmentData) {
    return this.executeAction('book-appointment', async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Appointment booked successfully! 🎉');
        realTimeUpdates.simulateAppointmentStatusUpdate(data.appointmentId, 'confirmed');
        return data;
      } else {
        throw new Error('Failed to book appointment');
      }
    }, 'Booking appointment...');
  }

  async cancelAppointment(appointmentId) {
    return this.executeAction(`cancel-${appointmentId}`, async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Appointment cancelled successfully');
        realTimeUpdates.simulateAppointmentStatusUpdate(appointmentId, 'cancelled');
        return true;
      } else {
        throw new Error('Failed to cancel appointment');
      }
    }, 'Cancelling appointment...');
  }

  async rescheduleAppointment(appointmentId, newDateTime) {
    return this.executeAction(`reschedule-${appointmentId}`, async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch(`/api/appointments/${appointmentId}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newDateTime }),
      });

      if (response.ok) {
        toast.success('Appointment rescheduled successfully! 📅');
        realTimeUpdates.simulateAppointmentStatusUpdate(appointmentId, 'rescheduled');
        return true;
      } else {
        throw new Error('Failed to reschedule appointment');
      }
    }, 'Rescheduling appointment...');
  }

  // Message Actions
  async sendMessage(conversationId, message) {
    return this.executeAction(`send-message-${conversationId}`, async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ conversationId, message }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Message sent! 💬');
        return data;
      } else {
        throw new Error('Failed to send message');
      }
    }, 'Sending message...');
  }

  async startVideoCall(participantId) {
    return this.executeAction(`video-call-${participantId}`, async () => {
      // Simulate video call start
      toast.success('Starting video call... 📹');
      
      // Redirect to video call page
      window.location.href = `/video-call?participantId=${participantId}`;
      
      return true;
    }, 'Initiating video call...');
  }

  // Report Actions
  async downloadReport(reportId, reportName) {
    return this.executeAction(`download-${reportId}`, async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch(`/api/reports/${reportId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = reportName || `report-${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('Report downloaded successfully! 📄');
        return true;
      } else {
        throw new Error('Failed to download report');
      }
    }, 'Downloading report...');
  }

  async uploadReport(file, metadata) {
    return this.executeAction('upload-report', async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));
      
      const response = await fetch('/api/reports/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Report uploaded successfully! 📤');
        return data;
      } else {
        throw new Error('Failed to upload report');
      }
    }, 'Uploading report...');
  }

  // Profile Actions
  async updateProfile(profileData) {
    return this.executeAction('update-profile', async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Profile updated successfully! ✅');
        
        // Update local storage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return data;
      } else {
        throw new Error('Failed to update profile');
      }
    }, 'Updating profile...');
  }

  async changePassword(passwordData) {
    return this.executeAction('change-password', async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        toast.success('Password changed successfully! 🔐');
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }
    }, 'Changing password...');
  }

  // Prescription Actions
  async createPrescription(prescriptionData) {
    return this.executeAction('create-prescription', async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/prescriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(prescriptionData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Prescription created successfully! 💊');
        return data;
      } else {
        throw new Error('Failed to create prescription');
      }
    }, 'Creating prescription...');
  }

  // Admin Actions
  async manageUser(userId, action, data = {}) {
    return this.executeAction(`manage-user-${userId}-${action}`, async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: action === 'delete' ? 'DELETE' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const actionMessages = {
          activate: 'User activated successfully',
          deactivate: 'User deactivated successfully',
          delete: 'User deleted successfully',
          edit: 'User updated successfully',
        };
        
        toast.success(actionMessages[action] || 'Action completed successfully');
        return true;
      } else {
        throw new Error(`Failed to ${action} user`);
      }
    }, `Processing user ${action}...`);
  }

  // Newsletter subscription
  async subscribeNewsletter(email) {
    return this.executeAction('newsletter-subscribe', async () => {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success('Successfully subscribed to newsletter! 📧');
        return true;
      } else {
        throw new Error('Failed to subscribe to newsletter');
      }
    }, 'Subscribing to newsletter...');
  }

  // Emergency contact
  async sendEmergencyAlert(location, message) {
    return this.executeAction('emergency-alert', async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/emergency/alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ location, message }),
      });

      if (response.ok) {
        toast.success('Emergency alert sent! 🚨', {
          duration: 6000,
          style: {
            background: '#ef4444',
            color: 'white',
          },
        });
        return true;
      } else {
        throw new Error('Failed to send emergency alert');
      }
    }, 'Sending emergency alert...');
  }
}

// Create a singleton instance
export const buttonActions = new ButtonActions();

export default buttonActions;
