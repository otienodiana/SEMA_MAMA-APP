import { API_BASE_URL, api } from '../config';

export const testApiConnection = async () => {
    try {
        const response = await api.get('/api/health-check/');
        console.log('API connection successful:', response.data);
        return true;
    } catch (error) {
        console.error('API connection failed:', error);
        return false;
    }
};

export const verifyEnvironment = () => {
    console.log({
        apiUrl: API_BASE_URL,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
    });
};