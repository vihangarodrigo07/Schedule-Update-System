import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('full_name');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// =======================
// AUTH API
// =======================
export const authAPI = {
  // ✅ EXISTING LOGIN (UNCHANGED)
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw error;
    }
  },

  // ✅ NEW REGISTER (ADDED ONLY)
  register: async (first_name, last_name, email, password) => {
    try {
      const response = await api.post('/register', {
        first_name,
        last_name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Email already registered');
      }
      throw error;
    }
  },
};

// =======================
// PROFILE API (UNCHANGED)
// =======================
export const profileAPI = {
  getProfile: async (userId) => {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  },
};

// =======================
// LECTURE API (ADD THIS NEW SECTION)
// =======================
export const lectureAPI = {
  // Get all lectures for a lecturer
  getLectures: async (lecturerId) => {
    const response = await api.get(`/lectures/lecturer/${lecturerId}`);
    return response.data;
  },

  // Cancel a lecture
  cancelLecture: async (lectureId, reason) => {
    const response = await api.post('/lectures/cancel', {
      lecture_id: lectureId,
      reason: reason
    });
    return response.data;
  },

  // Get cancellation status
  getCancellationStatus: async (lectureId) => {
    const response = await api.get(`/lectures/${lectureId}/cancellation-status`);
    return response.data;
  }
};
export default api;
