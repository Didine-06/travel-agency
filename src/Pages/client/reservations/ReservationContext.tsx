import { createContext, useContext } from 'react';

type ReservationContextType = {
  reloadBookings: () => Promise<void>;
};

export const ReservationContext = createContext<ReservationContextType | null>(null);

export const useReservationContext = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservationContext must be used within ReservationContext.Provider');
  }
  return context;
};
