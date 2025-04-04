const config = {
  development: {
    API_URL: 'http://localhost:8000',
    WEBSOCKET_URL: 'ws://localhost:8000'
  },
  production: {
    API_URL: 'https://sema-mama-app.onrender.com',
    WEBSOCKET_URL: 'wss://sema-mama-app.onrender.com'
  }
};

const environment = 'production';  // Force production environment
console.log('Current environment:', environment);
console.log('Using API URL:', config[environment].API_URL);

export const API_BASE_URL = config[environment].API_URL;
export default config[environment];
