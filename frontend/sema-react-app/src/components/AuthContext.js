import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL, API_ENDPOINTS, API_CONFIG } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
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
        } else {
          // Token invalid - clear storage
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const loginUrl = `${API_BASE_URL}${API_ENDPOINTS.login}`;
      console.log('Attempting login at:', loginUrl);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        ...API_CONFIG.fetchOptions,
        headers: API_CONFIG.baseHeaders,
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          is_admin_login: credentials.is_admin_login || false
        })
      });

      // Log response status and headers for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      if (response.status === 500) {
        throw new Error('Internal server error. Please try again later.');
      }

      const data = await response.json().catch(e => {
        throw new Error('Invalid response from server');
      });

      if (response.status === 401) {
        throw new Error(data.detail || 'Invalid credentials');
      }

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'An error occurred during login');
      }

      if (!data.access) {
        throw new Error('No access token received');
      }

      localStorage.setItem('access', data.access);
      if (data.refresh) localStorage.setItem('refresh', data.refresh);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'An error occurred during login');
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
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
