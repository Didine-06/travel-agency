// Axios client configuration with interceptors
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

// Custom error class to include error details
class ApiError extends Error {
  errorDetails?: any;
  
  constructor(message: string, errorDetails?: any) {
    super(message);
    this.name = 'ApiError';
    this.errorDetails = errorDetails;
  }
}

// Create axios instance with default config
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosClient.interceptors.response.use(
  (response) => {
    // Return response as-is, let the API methods handle response.data
    return response;
  },
  (error) => {
    if (error.response) {
      
      // Handle 401 Unauthorized - token expired
      if (error.response.status === 401) {
        // Ne rediriger vers /login que si on n'est pas déjà sur la page de login
        if (!window.location.pathname.includes('/login') || !window.location.pathname.includes('/register')) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }  
      // Pour les autres erreurs, les rejeter pour que le composant puisse les gérer
      return Promise.reject(error);
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Request setup error
      throw new Error(error.message || 'Request failed');
    }
  }
);

export default axiosClient;
