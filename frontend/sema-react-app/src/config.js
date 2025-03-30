console.log("Environment:", process.env.REACT_APP_ENV);
console.log("API Base URL:", process.env.REACT_APP_API_URL);

const getApiUrl = () => {
  const url = window?.ENV?.REACT_APP_API_URL || process?.env?.REACT_APP_API_URL || "https://sema-mama-app.onrender.com";
  console.log("Using API URL:", url);
  return url;
};

export const API_BASE_URL = getApiUrl();

export const API_ENDPOINTS = {
  login: "/api/users/login/",  // added back slashes
  register: "/api/users/register/",
  profile: "/api/users/me/",
  users: "/api/users/users/",
  community: "/api/community/forums/",
};

export const API_CONFIG = {
  baseHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  fetchOptions: {
    mode: 'cors',
    credentials: 'include',
    cache: 'no-cache'
  },
};
