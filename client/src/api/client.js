import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API methods
export const api = {
  // Auth
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (data) => apiClient.post('/auth/register', data),
  
  // Users
  getCurrentUser: () => apiClient.get('/users/me'),
  getUser: (username) => apiClient.get(`/users/${username}`),
  getUserTracks: (username) => apiClient.get(`/users/${username}/tracks`),
  updateProfile: (data) => apiClient.put('/users/me', data),
  followUser: (username) => apiClient.post(`/users/${username}/follow`),
  
  // Tracks
  getTracks: (params) => apiClient.get('/tracks', { params }),
  getTrack: (id) => apiClient.get(`/tracks/${id}`),
  createTrack: (data) => apiClient.post('/tracks', data),
  updateTrack: (id, data) => apiClient.put(`/tracks/${id}`, data),
  deleteTrack: (id) => apiClient.delete(`/tracks/${id}`),
  likeTrack: (id) => apiClient.post(`/tracks/${id}/like`),
  
  // Upload
  uploadAudio: (file) => {
    const formData = new FormData();
    formData.append('audio', file);
    return apiClient.post('/tracks/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/tracks/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default apiClient;
