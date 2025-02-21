import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api"; // Django backend URL

// User Registration
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register/`, userData);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

// User Login
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login/`, credentials);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await axios.post(`${API_BASE_URL}/logout/`);
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
