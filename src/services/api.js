import axios from 'axios';

// Create an axios instance with config from environment variables
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL?.endsWith('/') 
        ? import.meta.env.VITE_API_BASE_URL.slice(0, -1) 
        : import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Admin-API-Key': import.meta.env.VITE_ADMIN_API_KEY
    },
});

// Add a request interceptor for potential auth tokens later
api.interceptors.request.use(
    (config) => {
        // Ensure Content-Type is set
        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }
        
        // Ensure API Key is always present
        if (!config.headers['X-Admin-API-Key']) {
            config.headers['X-Admin-API-Key'] = import.meta.env.VITE_ADMIN_API_KEY;
        }
        
        // You can add auth headers here if needed, e.g. from localStorage
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
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
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default api;
