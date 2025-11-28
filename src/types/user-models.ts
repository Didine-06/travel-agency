// User management related types and interfaces

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'client' | 'agent' | 'admin';
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'client' | 'agent' | 'admin';
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'client' | 'agent' | 'admin';
  isActive?: boolean;
}

export interface UserResponse {
  user: User;
  message?: string;
}

export interface UsersListResponse {
  users: User[];
  total: number;
  page?: number;
  limit?: number;
}
