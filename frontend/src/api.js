import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

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
