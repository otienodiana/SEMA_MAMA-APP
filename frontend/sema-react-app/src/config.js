console.log("Environment:", process.env.REACT_APP_ENV);
console.log("API Base URL:", process.env.REACT_APP_API_URL);

const getApiUrl = () => {
  // First try window.ENV (set in index.html)
  if (window.ENV?.REACT_APP_API_URL) {
    return window.ENV.REACT_APP_API_URL;
  }
  
  // Then try process.env
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Use production URL if on vercel domain
  if (window.location.hostname === 'sema-react-app.vercel.app') {
    return 'https://sema-mama-app.onrender.com';
  }
  
  // Fallback for development
  return 'http://127.0.0.1:8000';
};

export const API_BASE_URL = 'http://localhost:8000';

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
