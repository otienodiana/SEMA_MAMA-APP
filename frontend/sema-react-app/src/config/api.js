export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  videos: '/api/educational/multimedia/',
  resources: '/api/educational/content/list/'
};

export const fetchFromAPI = async (endpoint) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('access');
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    
    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received data:', data);
    return data.results || data.list || [];  // Handle different response formats
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
