// TypeScript type definitions
// Add your custom types here

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'AGENT' | 'CLIENT';
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: string;
}

export interface Booking {
  id: number;
  clientId: number;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
