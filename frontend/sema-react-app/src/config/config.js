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

// Always use production environment for deployed frontend
const environment = 'production';
console.log('Environment:', environment);
console.log('Using API URL:', config[environment].API_URL);

export const API_BASE_URL = config[environment].API_URL;
export default config[environment];
