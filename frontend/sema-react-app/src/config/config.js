const config = {
  development: {
    API_URL: 'http://localhost:8000',
    WEBSOCKET_URL: 'ws://localhost:8000'
  },
  production: {
    API_URL: window.location.hostname.includes('vercel.app') 
      ? 'https://sema-mama-app.onrender.com'
      : 'http://localhost:8000',
    WEBSOCKET_URL: window.location.hostname.includes('vercel.app')
      ? 'wss://sema-mama-app.onrender.com'
      : 'ws://localhost:8000'
  }
};

const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
console.log('Current environment:', environment);
console.log('Using API URL:', config[environment].API_URL);
console.log('Current hostname:', window.location.hostname);

// Add error handling for API calls
export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default config[environment];
