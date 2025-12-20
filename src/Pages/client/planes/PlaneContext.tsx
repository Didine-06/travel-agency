import { createContext } from 'react';

interface PlaneContextType {
  reloadTickets: () => void;
}

export const PlaneContext = createContext<PlaneContextType>({
  reloadTickets: () => {},
});
