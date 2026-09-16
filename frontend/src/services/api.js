import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = rawApiUrl ? `${rawApiUrl.replace(/\/$/, '')}/api` : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization Token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (window.location.pathname.startsWith('/admin/dashboard')) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login?session_expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Public API Services
export const getSettings = () => api.get('/settings');
export const getLeaders = () => api.get('/leaders');
export const getMembers = () => api.get('/members');
export const getActivities = () => api.get('/activities');
export const getGallery = (category = '') => api.get(`/gallery${category ? `?category=${category}` : ''}`);
export const sendMessage = (data) => api.post('/messages', data);

// Auth Services
export const loginAdmin = (username, password) => api.post('/auth/login', { username, password });
export const verifyAdminToken = () => api.get('/auth/verify');
export const changeAdminPassword = (data) => api.post('/auth/change-password', data);

// Admin Management API Services
export const updateSettings = (data) => api.put('/settings', data);
export const updateLeader = (id, data) => api.put(`/leaders/${id}`, data);

export const addMember = (data) => api.post('/members', data);
export const updateMember = (id, data) => api.put(`/members/${id}`, data);
export const deleteMember = (id) => api.delete(`/members/${id}`);

export const addActivity = (data) => api.post('/activities', data);
export const updateActivity = (id, data) => api.put(`/activities/${id}`, data);
export const deleteActivity = (id) => api.delete(`/activities/${id}`);

export const addGalleryItem = (data) => api.post('/gallery', data);
export const updateGalleryItem = (id, data) => api.put(`/gallery/${id}`, data);
export const deleteGalleryItem = (id) => api.delete(`/gallery/${id}`);

export const getMessages = () => api.get('/messages');
export const deleteMessage = (id) => api.delete(`/messages/${id}`);

// Image Upload Service
export const uploadSingleImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload/single', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const uploadMultipleImages = (files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });
  return api.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export default api;
