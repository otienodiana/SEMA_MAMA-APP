import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL, API_ENDPOINTS, API_CONFIG } from '../config';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem("access");
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROFILE}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        ...API_CONFIG.baseHeaders
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                localStorage.removeItem("access");
                localStorage.removeItem("user");
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const loginUrl = `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`;
            console.log('Attempting login at:', loginUrl);

            const response = await axios({
                method: 'post',
                url: loginUrl,
                data: {
                    username: credentials.username.trim(),
                    password: credentials.password.trim()
                },
                headers: API_CONFIG.baseHeaders
            });

            if (response.data && response.data.access) {
                localStorage.setItem('access', response.data.access);
                if (response.data.refresh) {
                    localStorage.setItem('refresh', response.data.refresh);
                }
                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    setUser(response.data.user);
                }
                return response.data;
            }
            
            throw new Error('Invalid response from server');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
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
