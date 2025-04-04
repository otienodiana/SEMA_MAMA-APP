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

const environment = process.env.NODE_ENV || 'development';
export default config[environment];
