console.log("API Base URL:", process.env.REACT_APP_API_URL);

export const API_BASE_URL = process.env.REACT_APP_API_URL || "Fallback URL if needed";

export const API_ENDPOINTS = {
  login: "/api/users/login/",
  register: "/api/users/register/",
  profile: "/api/users/me/",
  users: "/api/users/users/",
  community: "/api/community/forums/",
};

export const API_CONFIG = {
  baseHeaders: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  fetchOptions: {
    mode: "cors",
    credentials: "include",
  },
};
