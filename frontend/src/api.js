import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Firebase authentication
export const verifyFirebaseToken = (idToken) => api.post('/firebase-auth/verify', { idToken });
export const getFirebaseUser = (uid) => api.get(`/firebase-auth/user/${uid}`);

// Authentication
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (userData) => api.put('/auth/profile', userData);
export const changePassword = (passwordData) => api.put('/auth/password', passwordData);
export const verifyToken = () => api.get('/auth/verify');
export const logout = () => api.post('/auth/logout');
export const deactivateAccount = () => api.delete('/auth/account');

// Courses
export const getCourses = () => api.get('/courses');
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// Notes
export const getNotes = (courseId) => api.get(`/notes${courseId ? `?courseId=${courseId}` : ''}`);
export const createNote = (data) => api.post('/notes', data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

// Summaries
export const generateSummary = (noteId) => api.post('/summaries/generate', { noteId });
export const getSummary = (noteId) => api.get(`/summaries/${noteId}`);
export const getSummaryStatus = () => api.get('/summaries/status');

export default api;
