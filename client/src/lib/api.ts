import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-api-domain.com/api' 
    : 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  }
};

// Course API calls
export const courseAPI = {
  getCourses: async (params?: any) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getCourse: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/courses/categories');
    return response.data;
  },

  getEnrolledCourses: async (params?: any) => {
    const response = await api.get('/courses/enrolled', { params });
    return response.data;
  },

  enrollInCourse: async (courseId: string) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  // Admin only
  createCourse: async (courseData: any) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id: string, courseData: any) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id: string) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  }
};

// Media API calls
export const mediaAPI = {
  getCourseMedia: async (courseId: string) => {
    const response = await api.get(`/media/course/${courseId}`);
    return response.data;
  },

  // Admin only
  addMedia: async (courseId: string, mediaData: any) => {
    const response = await api.post(`/media/course/${courseId}`, mediaData);
    return response.data;
  },

  uploadMedia: async (courseId: string, formData: FormData) => {
    const response = await api.post(`/media/course/${courseId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateMedia: async (id: string, mediaData: any) => {
    const response = await api.put(`/media/${id}`, mediaData);
    return response.data;
  },

  deleteMedia: async (id: string) => {
    const response = await api.delete(`/media/${id}`);
    return response.data;
  },

  reorderMedia: async (courseId: string, mediaOrder: any[]) => {
    const response = await api.put(`/media/course/${courseId}/reorder`, { mediaOrder });
    return response.data;
  }
};

// Payment API calls
export const paymentAPI = {
  createPayment: async (amount: number) => {
    const response = await api.post('/payments/create', { amount });
    return response.data;
  },

  confirmPayment: async (paymentId: string, transactionId?: string) => {
    const response = await api.post('/payments/confirm', { paymentId, transactionId });
    return response.data;
  },

  getPaymentHistory: async (params?: any) => {
    const response = await api.get('/payments/history', { params });
    return response.data;
  },

  // Admin only
  getAllPayments: async (params?: any) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  getPaymentStats: async () => {
    const response = await api.get('/payments/stats');
    return response.data;
  },

  refundPayment: async (id: string, reason?: string) => {
    const response = await api.post(`/payments/${id}/refund`, { reason });
    return response.data;
  }
};

// Feedback API calls
export const feedbackAPI = {
  submitFeedback: async (courseId: string, rating: number, comment: string) => {
    const response = await api.post('/feedback', { courseId, rating, comment });
    return response.data;
  },

  getCourseFeedback: async (courseId: string, params?: any) => {
    const response = await api.get(`/feedback/course/${courseId}`, { params });
    return response.data;
  },

  getUserFeedback: async (params?: any) => {
    const response = await api.get('/feedback/user', { params });
    return response.data;
  },

  updateFeedback: async (id: string, rating: number, comment: string) => {
    const response = await api.put(`/feedback/${id}`, { rating, comment });
    return response.data;
  },

  deleteFeedback: async (id: string) => {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  }
};

// Admin API calls
export const adminAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getStudents: async (params?: any) => {
    const response = await api.get('/admin/students', { params });
    return response.data;
  },

  getStudent: async (id: string) => {
    const response = await api.get(`/admin/students/${id}`);
    return response.data;
  },

  updateStudent: async (id: string, data: any) => {
    const response = await api.put(`/admin/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id: string) => {
    const response = await api.delete(`/admin/students/${id}`);
    return response.data;
  },

  getAllFeedback: async (params?: any) => {
    const response = await api.get('/admin/feedback', { params });
    return response.data;
  },

  getRecentActivity: async (params?: any) => {
    const response = await api.get('/admin/activity', { params });
    return response.data;
  }
};

export default api;