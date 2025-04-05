import axios from "axios";

const API_URL = "http://localhost:8000/api/users";

// ✅ Save tokens in localStorage after login
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login/`, credentials);

  if (response.data.access) {
    localStorage.setItem("accessToken", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);
  }

  return response.data;
};

// ✅ Logout function to remove tokens
export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// ✅ Get stored access token
export const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

// ✅ Refresh token if access token expires
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null; // ❌ No refresh token, user must log in again

  try {
    const response = await axios.post(`${API_URL}/token/refresh/`, {
      refresh: refreshToken,
    });

    localStorage.setItem("accessToken", response.data.access); // ✅ Save new access token
    return response.data.access;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    logoutUser(); // ❌ Log out if refresh token is invalid
    return null;
  }
};
