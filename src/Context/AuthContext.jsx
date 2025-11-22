import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const AuthContext = createContext(null);

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    
    if (storedUser && accessToken) {
      const parsedUser = JSON.parse(storedUser);
      // Verify token is not expired
      const tokenData = decodeToken(accessToken);
      if (tokenData && tokenData.exp * 1000 > Date.now()) {
        setUser(parsedUser);
      } else {
        // Token expired, clear storage
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Call real API
      const response = await api.auth.login(credentials);
      
      // Decode JWT to get role
      const tokenData = decodeToken(response.accessToken);
      
      // Build user object
      const userData = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        name: `${response.user.firstName} ${response.user.lastName}`,
        role: tokenData?.role || 'CLIENT',
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Navigate based on role from JWT
      switch (userData.role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'AGENT':
          navigate('/agent/dashboard');
          break;
        case 'CLIENT':
          navigate('/client/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
