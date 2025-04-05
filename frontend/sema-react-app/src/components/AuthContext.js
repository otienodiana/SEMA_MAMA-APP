import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL, API_ENDPOINTS, API_CONFIG } from '../config';
import axios from 'axios';  // Add this import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Add retry logic
        const maxRetries = 3;
        let attempt = 0;
        
        while (attempt < maxRetries) {
          try {
            const token = localStorage.getItem("access");
            if (!token) {
              setLoading(false);
              return;
            }

            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.profile}`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              mode: 'cors'
            });

            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.log(`Attempt ${attempt + 1} failed:`, err);
            attempt++;
            if (attempt === maxRetries) throw err;
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear potentially invalid auth data
        localStorage.removeItem("access");
        localStorage.removeItem("user");
        setUser(null);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const loginUrl = `${API_BASE_URL}/api/users/login/`;
      console.log('Attempting login at:', loginUrl);

      const response = await axios({
        method: 'post',
        url: loginUrl,
        data: credentials,
        headers: API_CONFIG.baseHeaders,
        withCredentials: true,
        timeout: 5000,
      });

      if (response.status === 200 && response.data.access) {
        localStorage.setItem('access', response.data.access);
        if (response.data.refresh) {
          localStorage.setItem('refresh', response.data.refresh);
        }
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setUser(response.data.user);
        }
        return response.data;
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (!error.response) {
        throw new Error('Network error - please check if the server is running');
      }
      
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
