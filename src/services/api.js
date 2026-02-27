import axios from 'axios';

// Create an axios instance with config from environment variables
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'https://api.selvagam.com/api/v1',
    headers: {
        'X-Admin-API-Key': import.meta.env.VITE_ADMIN_API_KEY
    },
});

// Add a request interceptor for potential auth tokens later
api.interceptors.request.use(
    (config) => {
        // Ensure the API Key is injected into every request header
        config.headers['X-Admin-API-Key'] = import.meta.env.VITE_ADMIN_API_KEY;
        
        // Handle Content-Type intelligently
        if (config.data instanceof FormData) {
            // For FormData, we MUST NOT set Content-Type manually. 
            // The browser needs to set it to include the boundary string.
            delete config.headers['Content-Type'];
        } else if (!config.headers['Content-Type'] && config.data) {
            config.headers['Content-Type'] = 'application/json';
        }
        
        // Attach Bearer token from localStorage if available
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If token is expired or invalid, redirect to login
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default api;
