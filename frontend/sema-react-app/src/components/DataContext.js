import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const DataContext = createContext();

// Update API configuration with env-specific URLs and retries
const API_CONFIG = {
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://sema-mama-app.onrender.com' 
    : 'http://127.0.0.1:8000',  // Changed from localhost to 127.0.0.1
  endpoints: {
    content: '/api/content/contents/',
    appointments: '/api/appointments/list/',
    community: '/api/community/forums/'
  },
  timeout: 15000,
  retries: 2
};

const API_ENDPOINT = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.content}`;

// Default/fallback data
const defaultFiles = [];

export function DataProvider({ children }) {
  const [files, setFiles] = useState(defaultFiles);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleError = (error) => {
    if (!navigator.onLine) {
      setError("No internet connection. Please check your network.");
    } else if (error.code === "ECONNABORTED") {
      setError(`Request timed out after ${API_CONFIG.timeout}ms. The server might be down.`);
    } else if (error.response?.status === 404) {
      setError(`API endpoint not found at ${API_ENDPOINT}`);
    } else if (error.response?.status === 401) {
      setError("Authentication failed. Please login again.");
      localStorage.removeItem("access");
    } else {
      setError(`Failed to load content: ${error.message || 'Unknown error'}`);
    }
    setFiles([]);
  };

  useEffect(() => {
    let retryCount = 0;

    const fetchFiles = async () => {
      const token = localStorage.getItem("access");
      
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const apiCalls = Object.entries(API_CONFIG.endpoints).map(([key, endpoint]) => 
          axios({
            method: 'GET',
            url: `${API_CONFIG.baseURL}${endpoint}`,
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            timeout: API_CONFIG.timeout,
            withCredentials: true
          }).catch(error => {
            console.warn(`Failed to fetch from ${key}:`, error.message);
            return { data: [] };
          })
        );

        const responses = await Promise.all(apiCalls);
        const allData = responses.flatMap(response => response.data);
        
        setFiles(allData);
        setError(null);

      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const fetchCommunityData = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        console.warn("No auth token available");
        return;
      }

      const response = await fetch("http://localhost:8000/api/community/data/", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch from community:", error);
      // Handle specific error types
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.log("Network error - Backend may be unavailable");
      }
      throw error;
    }
  };

  const createContent = async (contentData) => {
    const token = localStorage.getItem("access");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const formData = new FormData();
    Object.keys(contentData).forEach(key => {
      formData.append(key, contentData[key]);
    });

    try {
      const response = await axios.post(API_ENDPOINT, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      setFiles(prevFiles => [...prevFiles, response.data]);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{ 
      files, 
      loading, 
      error,
      isError: !!error,
      isEmpty: files.length === 0,
      createContent 
    }}>
      {children}
    </DataContext.Provider>
  );
}
