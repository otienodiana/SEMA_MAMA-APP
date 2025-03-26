const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://127.0.0.1:8000'
  : process.env.REACT_APP_API_URL;

export { API_BASE_URL };

export const API_ENDPOINTS = {
  login: '/api/users/login/',
  register: '/api/users/register/',
  profile: '/api/users/me/',
  users: '/api/users/users/',
  community: '/api/community/forums/'
};

export const API_CONFIG = {
  baseHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  fetchOptions: {
    mode: 'cors',
    credentials: 'include'
  }
};
