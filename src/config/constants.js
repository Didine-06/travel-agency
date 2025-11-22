export const APP_NAME = 'Travel Agency';

export const ROLES = {
  ADMIN: 'ADMIN',
  AGENT: 'AGENT',
  CLIENT: 'CLIENT'
};

export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    ABOUT: '/about',
    SERVICES: '/services',
    DESTINATIONS: '/destinations',
    LOGIN: '/login',
    REGISTER: '/register',
    UNAUTHORIZED: '/unauthorized'
  },
  CLIENT: {
    DASHBOARD: '/client/dashboard',
    PROFILE: '/client/profile'
  },
  AGENT: {
    DASHBOARD: '/agent/dashboard',
    BOOKINGS: '/agent/bookings'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users'
  }
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
