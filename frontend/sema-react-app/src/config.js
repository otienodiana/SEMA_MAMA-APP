import axios from 'axios';

console.log("Environment:", process.env.REACT_APP_ENV);
console.log("API Base URL:", process.env.REACT_APP_API_URL);

const getApiUrl = () => {
  if (window.location.hostname === 'sema-react-app.vercel.app') {
    return 'https://sema-mama-app.onrender.com/api';
  }
  return process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
};

export const API_BASE_URL = getApiUrl();

// Create axios instance with base configuration

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to handle auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    // Add leading slash and ensure proper media URL structure
    const cleanPath = path.replace(/^\/?(media\/)?/, '');
    return `${API_BASE_URL}/media/${cleanPath}`;
};

export const API_ENDPOINTS = {
  login: "/api/users/login/",
  register: "/api/users/register/",
  profile: "/api/users/me/",
  users: "/api/users/users/",
  community: "/api/community/forums/",
  forumDetails: (id) => `/api/community/forums/${id}/`,
  joinForum: (id) => `/api/community/forums/${id}/join/`,
  exitForum: (id) => `/api/community/forums/${id}/exit/`,
  chat: {
    users: '/api/mama/chat/users/',
    history: (userId) => `/api/mama/chat/history/${userId}/`,
    send: '/api/mama/chat/send/'
  }
};

export const API_CONFIG = {
  baseHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  fetchOptions: {
    mode: 'cors',
    credentials: 'include',
  },
};
