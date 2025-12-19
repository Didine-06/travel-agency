import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { LoginCredentials } from '../types/auth-models';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: 'ADMIN' | 'AGENT' | 'CLIENT';
  avatarUrl?: string;
  languageId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface TokenData {
  exp: number;
  role: string;
  [key: string]: any;
}

// Helper function to decode JWT token
const decodeToken = (token: string): TokenData | null => {
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    
    if (storedUser && accessToken) {
      const parsedUser = JSON.parse(storedUser) as User;
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

  const login = async (credentials: LoginCredentials) => {
    try {
      // Call real API
      const response = await api.auth.login(credentials);
      // Build user object
      const userData: User = {
        id: response.data.user.id,
        email: response.data.user.email,
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        name: `${response.data.user.firstName} ${response.data.user.lastName}`,
        role: response.data.user.role.toUpperCase() as 'ADMIN' | 'AGENT' | 'CLIENT',
        languageId: response.data.user.languageId,
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
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
