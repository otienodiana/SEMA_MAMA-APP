import axios from 'axios';

// Environment detection
const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// Base URL configuration
export const API_BASE_URL = isProd 
    ? 'https://sema-mama-app.onrender.com'
    : 'http://localhost:8000';

console.log('Current environment:', isProd ? 'production' : 'development');
console.log('API Base URL:', API_BASE_URL);

// API endpoints configuration
export const API_ENDPOINTS = {
    REGISTER: '/api/users/register/',  
    LOGIN: '/api/users/login/',
    PROFILE: '/api/users/me/',
};

// Default headers configuration
export const API_CONFIG = {
    baseHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Enhanced axios instance configuration
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: API_CONFIG.baseHeaders,
    withCredentials: true,
    timeout: 10000, // 10 second timeout
});

// Enhanced request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Log requests in development
        if (!isProd) {
            console.log(`${config.method?.toUpperCase()} ${config.url}`, config);
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!isProd) {
            console.error('Response error:', error.response || error);
        }
        return Promise.reject(error);
    }
);

// Media URL helper
export const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^\/?(media\/)?/, '');
    return `${API_BASE_URL}/media/${cleanPath}`;
};
