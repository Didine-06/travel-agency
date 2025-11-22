import { useAuth } from '../Context/AuthContext';

export const useUser = () => {
  const { user } = useAuth();
  return user;
};

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

export const useRole = () => {
  const { user } = useAuth();
  return user?.role;
};
