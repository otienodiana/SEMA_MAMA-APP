export const API_BASE_URL = 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  login: '/api/users/custom-login/',
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
    credentials: 'include',
    mode: 'cors'
  }
};
