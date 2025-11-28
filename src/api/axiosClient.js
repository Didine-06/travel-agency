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
      // Server responded with error
      const responseData = error.response.data;
      
      // Handle 401 Unauthorized - token expired
      if (error.response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // If backend returned error with isError flag
      if (responseData?.isError) {
        const errorMessage = responseData.error || responseData.message || error.response.statusText;
        const apiError = new Error(errorMessage);
        apiError.errorDetails = responseData.errorDetails;
        throw apiError;
      }
      
      // Fallback error message
      const message = responseData?.message || error.response.statusText;
      throw new Error(message);
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
