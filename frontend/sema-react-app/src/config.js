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
  
  // Fallback for development
  return 'http://127.0.0.1:8000';
};

export const API_BASE_URL = getApiUrl();

export const API_ENDPOINTS = {
  login: "/api/users/login/",
  register: "/api/users/register/",
  profile: "/api/users/me/",
  users: "/api/users/users/",
  community: "/api/community/forums/",
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
