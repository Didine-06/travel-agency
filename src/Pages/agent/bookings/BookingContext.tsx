import { createContext, useContext } from 'react';

type BookingContextType = {
  reloadBookings: () => Promise<void>;
};

export const BookingContext = createContext<BookingContextType | null>(null);

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within BookingContext.Provider');
  }
  return context;
};
