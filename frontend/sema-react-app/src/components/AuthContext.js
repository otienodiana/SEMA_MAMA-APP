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
      const loginUrl = `${API_BASE_URL}/api/users/login/`;
      console.log('Full login URL:', loginUrl);
      console.log('Login credentials:', { 
        username: credentials.username,
        is_admin_login: credentials.is_admin_login 
      });

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          is_admin_login: credentials.is_admin_login || false
        }),
        mode: 'cors',
        credentials: 'include'
      });

      // Log full response for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      let responseData;
      try {
        const text = await response.text();
        console.log('Raw response:', text);
        responseData = text ? JSON.parse(text) : null;
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid server response format');
      }

      if (response.status === 500) {
        console.error('Server error details:', responseData);
        throw new Error('Server error - please try again later');
      }

      if (response.status === 401) {
        throw new Error(responseData?.detail || 'Invalid credentials');
      }

      if (!response.ok || !responseData) {
        throw new Error(responseData?.detail || 'Login failed');
      }

      if (!responseData.access) {
        console.error('Missing access token in response:', responseData);
        throw new Error('Invalid server response');
      }

      localStorage.setItem('access', responseData.access);
      if (responseData.refresh) localStorage.setItem('refresh', responseData.refresh);
      if (responseData.user) {
        localStorage.setItem('user', JSON.stringify(responseData.user));
        setUser(responseData.user);
      }

      return responseData;
    } catch (error) {
      console.error('Detailed login error:', error);
      throw error;
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
