import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Handle common error scenarios
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    }
    
    throw error;
  }
);

// Courses API
export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

// Notes API
export const notesAPI = {
  getAll: () => api.get('/notes'),
  getById: (id) => api.get(`/notes/${id}`),
  getByCourseId: (courseId) => api.get(`/courses/${courseId}/notes`),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
  getContent: (id) => api.get(`/notes/${id}/content`),
};

// Summaries API
export const summariesAPI = {
  generate: (noteId) => api.post(`/summaries/notes/${noteId}/generate`),
  getByNoteId: (noteId) => api.get(`/summaries/notes/${noteId}`),
  getLatestByNoteId: (noteId) => api.get(`/summaries/notes/${noteId}/latest`),
  getById: (id) => api.get(`/summaries/${id}`),
  delete: (id) => api.delete(`/summaries/${id}`),
  getStatus: () => api.get('/summaries/status'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health', { baseURL: API_BASE_URL.replace('/api', '') }),
};

export default api;
