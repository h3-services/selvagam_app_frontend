import axios from 'axios';

// Create an axios instance with config from environment variables
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor for potential auth tokens later
api.interceptors.request.use(
    (config) => {
        // Ensure Content-Type is set
        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
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
