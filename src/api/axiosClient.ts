// Axios client configuration with interceptors
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

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
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
      
      // Pour les autres erreurs (400, 403, 404, 500, etc.), 
      // retourner un objet structuré au lieu de rejeter
      const errorResponse = {
        data: {
          isSuccess: false,
          message: error.response.data?.message || error.response.data?.error || error.message || 'An error occurred',
          data: null,
          statusCode: error.response.status
        }
      };
      return errorResponse;
    } else if (error.request) {
      // Request made but no response
      return {
        data: {
          isSuccess: false,
          message: 'No response from server. Please check your connection.',
          data: null
        }
      };
    } else {
      // Request setup error
      return {
        data: {
          isSuccess: false,
          message: error.message || 'Request failed',
          data: null
        }
      };
    }
  }
);

export default axiosClient;
