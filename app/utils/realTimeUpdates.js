// Real-time updates utility for MediMate application
'use client';

import toast from 'react-hot-toast';

export class RealTimeUpdates {
  constructor() {
    this.intervals = new Map();
    this.isActive = false;
  }

  // Start real-time updates for appointments
  startAppointmentUpdates(callback, intervalMs = 5000) {
    if (this.intervals.has('appointments')) {
      this.stopAppointmentUpdates();
    }

    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) return;

        const userRole = localStorage.getItem('userRole');
        const endpoint = userRole === 'doctor' ? '/api/appointments/doctor' : '/api/appointments/patient';
        
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          callback(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    }, intervalMs);

    this.intervals.set('appointments', interval);
    this.isActive = true;
  }

  // Stop appointment updates
  stopAppointmentUpdates() {
    const interval = this.intervals.get('appointments');
    if (interval) {
      clearInterval(interval);
      this.intervals.delete('appointments');
    }
  }

  // Start real-time updates for messages
  startMessageUpdates(callback, intervalMs = 3000) {
    if (this.intervals.has('messages')) {
      this.stopMessageUpdates();
    }

    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch('/api/messages/conversations', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          callback(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }, intervalMs);

    this.intervals.set('messages', interval);
  }

  // Stop message updates
  stopMessageUpdates() {
    const interval = this.intervals.get('messages');
    if (interval) {
      clearInterval(interval);
      this.intervals.delete('messages');
    }
  }

  // Start real-time notifications
  startNotificationUpdates(callback, intervalMs = 10000) {
    if (this.intervals.has('notifications')) {
      this.stopNotificationUpdates();
    }

    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch('/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          callback(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }, intervalMs);

    this.intervals.set('notifications', interval);
  }

  // Stop notification updates
  stopNotificationUpdates() {
    const interval = this.intervals.get('notifications');
    if (interval) {
      clearInterval(interval);
      this.intervals.delete('notifications');
    }
  }

  // Stop all real-time updates
  stopAllUpdates() {
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.intervals.clear();
    this.isActive = false;
  }

  // Show real-time notification
  showNotification(type, message, options = {}) {
    const defaultOptions = {
      duration: 4000,
      position: 'top-right',
    };

    const finalOptions = { ...defaultOptions, ...options };

    switch (type) {
      case 'success':
        toast.success(message, finalOptions);
        break;
      case 'error':
        toast.error(message, finalOptions);
        break;
      case 'info':
        toast(message, {
          ...finalOptions,
          icon: 'ℹ️',
        });
        break;
      case 'warning':
        toast(message, {
          ...finalOptions,
          icon: '⚠️',
        });
        break;
      default:
        toast(message, finalOptions);
    }
  }

  // Simulate real-time appointment status updates
  simulateAppointmentStatusUpdate(appointmentId, newStatus) {
    const statusMessages = {
      confirmed: 'Appointment confirmed! 🎉',
      cancelled: 'Appointment cancelled 📅',
      completed: 'Appointment completed ✅',
      rescheduled: 'Appointment rescheduled 🔄',
    };

    if (statusMessages[newStatus]) {
      this.showNotification('info', statusMessages[newStatus], {
        duration: 5000,
      });
    }
  }

  // Simulate real-time message notifications
  simulateNewMessage(senderName, message) {
    this.showNotification('info', `New message from ${senderName}: ${message.substring(0, 50)}...`, {
      duration: 6000,
    });
  }

  // Initialize real-time updates for the entire app
  initializeAppUpdates() {
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');

    if (!token) return;

    // Start appointment updates
    this.startAppointmentUpdates((appointments) => {
      // This will be used by components to update their state
      window.dispatchEvent(new CustomEvent('appointmentsUpdated', {
        detail: appointments
      }));
    });

    // Start message updates
    this.startMessageUpdates((messages) => {
      window.dispatchEvent(new CustomEvent('messagesUpdated', {
        detail: messages
      }));
    });

    // Start notification updates
    this.startNotificationUpdates((notifications) => {
      window.dispatchEvent(new CustomEvent('notificationsUpdated', {
        detail: notifications
      }));
    });

    console.log('Real-time updates initialized for', userRole);
  }
}

// Create a singleton instance
export const realTimeUpdates = new RealTimeUpdates();

// Auto-initialize on app load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      realTimeUpdates.initializeAppUpdates();
    }
  });

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    realTimeUpdates.stopAllUpdates();
  });
}

export default realTimeUpdates;
