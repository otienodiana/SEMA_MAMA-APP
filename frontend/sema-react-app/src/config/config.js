const config = {
  development: {
    API_URL: 'http://localhost:8000',
    WEBSOCKET_URL: 'ws://localhost:8000'
  },
  production: {
    API_URL: 'http://sema-mama-app.onrender.com', // Changed from https to http temporarily
    WEBSOCKET_URL: 'ws://sema-mama-app.onrender.com'  // Changed from wss to ws temporarily
  }
};

const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
console.log('Current environment:', environment);
console.log('Using API URL:', config[environment].API_URL);

// Add error handling for API calls
export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
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
