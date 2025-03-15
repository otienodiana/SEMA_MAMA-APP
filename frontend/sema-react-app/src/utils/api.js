import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set Authorization token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers["Authorization"];
  }
};

export default api;
