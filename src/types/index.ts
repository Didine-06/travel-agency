// TypeScript type definitions
// Central export for all type definitions

// Export all type definitions
export * from './Destination-models';
export * from './auth-models';
export * from './user-models';
export * from './booking-models';

// Legacy types (consider moving to separate files)
export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface Booking {
  id: number;
  clientId: number;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
