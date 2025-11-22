// API client for backend communication
import axiosClient from './axiosClient';

export const api = {
  auth: {
    login: async (credentials) => {
      const response = await axiosClient.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.isSuccess && response.data) {
        // Store access token
        localStorage.setItem('accessToken', response.data.accessToken);
        
        return {
          accessToken: response.data.accessToken,
          user: response.data.user,
        };
      }

      throw new Error(response.message || 'Login failed');
    },
    
    register: async (userData) => {
      const response = await axiosClient.post('/auth/register', userData);
      return response;
    },
    
    logout: async () => {
      try {
        await axiosClient.post('/auth/logout');
      } catch (error) {
        console.error('Logout API error:', error);
      }
      // Clear token from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
    
    getCurrentUser: async () => {
      const response = await axiosClient.get('/auth/me');
      return response.data;
    }
  },
  
  users: {
    getAll: async () => {
      const response = await axiosClient.get('/users');
      return response.data;
    },
    
    getById: async (id) => {
      const response = await axiosClient.get(`/users/${id}`);
      return response.data;
    },
    
    create: async (userData) => {
      const response = await axiosClient.post('/users', userData);
      return response.data;
    },
    
    update: async (id, userData) => {
      const response = await axiosClient.put(`/users/${id}`, userData);
      return response.data;
    },
    
    delete: async (id) => {
      const response = await axiosClient.delete(`/users/${id}`);
      return response.data;
    }
  },
  
  bookings: {
    getAll: async () => {
      const response = await axiosClient.get('/bookings');
      return response.data;
    },
    
    getById: async (id) => {
      const response = await axiosClient.get(`/bookings/${id}`);
      return response.data;
    },
    
    create: async (bookingData) => {
      const response = await axiosClient.post('/bookings', bookingData);
      return response.data;
    },
    
    update: async (id, bookingData) => {
      const response = await axiosClient.put(`/bookings/${id}`, bookingData);
      return response.data;
    },
    
    delete: async (id) => {
      const response = await axiosClient.delete(`/bookings/${id}`);
      return response.data;
    }
  }
};

// Export axios client for custom requests if needed
export { axiosClient };
