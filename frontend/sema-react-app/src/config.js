import axios from 'axios';

const isProd = process.env.REACT_APP_ENV === 'production';

// Base URL configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || (isProd 
    ? 'https://sema-mama-app.onrender.com'
    : 'http://localhost:8000');

// API endpoints configuration
export const API_ENDPOINTS = {
    LOGIN: '/api/users/login/',
    REGISTER: '/api/users/register/',
    PROFILE: '/api/users/me/',
};

// Default headers configuration
export const API_CONFIG = {
    baseHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Axios instance configuration
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: API_CONFIG.baseHeaders,
    withCredentials: true
});

// Request interceptor for authentication
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Media URL helper
export const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^\/?(media\/)?/, '');
    return `${API_BASE_URL}/media/${cleanPath}`;
};
