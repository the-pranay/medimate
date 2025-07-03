// API Configuration and Axios Setup
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },
};

// User API calls
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  uploadProfileImage: async (formData) => {
    const response = await api.post('/users/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Appointment API calls
export const appointmentAPI = {
  getDoctors: async (filters = {}) => {
    const response = await api.get('/appointments/doctors', { params: filters });
    return response.data;
  },

  getDoctorSlots: async (doctorId, date) => {
    const response = await api.get(`/appointments/doctors/${doctorId}/slots`, {
      params: { date },
    });
    return response.data;
  },

  bookAppointment: async (appointmentData) => {
    const response = await api.post('/appointments/book', appointmentData);
    return response.data;
  },

  getAppointments: async (filters = {}) => {
    const response = await api.get('/appointments', { params: filters });
    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await api.put(`/appointments/${appointmentId}/cancel`);
    return response.data;
  },

  rescheduleAppointment: async (appointmentId, newDateTime) => {
    const response = await api.put(`/appointments/${appointmentId}/reschedule`, {
      dateTime: newDateTime,
    });
    return response.data;
  },
};

// Medical Records API calls
export const medicalRecordsAPI = {
  getReports: async (filters = {}) => {
    const response = await api.get('/medical-records/reports', { params: filters });
    return response.data;
  },

  uploadReport: async (formData) => {
    const response = await api.post('/medical-records/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  downloadReport: async (reportId) => {
    const response = await api.get(`/medical-records/download/${reportId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  deleteReport: async (reportId) => {
    const response = await api.delete(`/medical-records/${reportId}`);
    return response.data;
  },

  getPrescriptions: async () => {
    const response = await api.get('/medical-records/prescriptions');
    return response.data;
  },
};

// Messages API calls
export const messagesAPI = {
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  getMessages: async (conversationId) => {
    const response = await api.get(`/messages/conversations/${conversationId}`);
    return response.data;
  },

  sendMessage: async (conversationId, messageData) => {
    const response = await api.post(`/messages/conversations/${conversationId}`, messageData);
    return response.data;
  },

  markAsRead: async (conversationId) => {
    const response = await api.put(`/messages/conversations/${conversationId}/read`);
    return response.data;
  },

  uploadAttachment: async (formData) => {
    const response = await api.post('/messages/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Payment API calls
export const paymentAPI = {
  createPaymentIntent: async (amount, appointmentId) => {
    const response = await api.post('/payments/create-intent', {
      amount,
      appointmentId,
    });
    return response.data;
  },

  confirmPayment: async (paymentIntentId) => {
    const response = await api.post('/payments/confirm', { paymentIntentId });
    return response.data;
  },

  getPaymentHistory: async () => {
    const response = await api.get('/payments/history');
    return response.data;
  },
};

// Video Call API calls
export const videoCallAPI = {
  generateToken: async (channelName, uid) => {
    const response = await api.post('/video/generate-token', { channelName, uid });
    return response.data;
  },

  startCall: async (appointmentId) => {
    const response = await api.post(`/video/start-call/${appointmentId}`);
    return response.data;
  },

  endCall: async (appointmentId) => {
    const response = await api.post(`/video/end-call/${appointmentId}`);
    return response.data;
  },
};

// Notifications API calls
export const notificationAPI = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await api.put('/notifications/settings', settings);
    return response.data;
  },
};

export default api;
