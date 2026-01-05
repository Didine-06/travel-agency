import { createContext, useContext } from 'react';

type FlightTicketContextType = {
  reloadFlightTickets: () => Promise<void>;
};

export const FlightTicketContext = createContext<FlightTicketContextType | null>(null);

export const useFlightTicketContext = () => {
  const context = useContext(FlightTicketContext);
  if (!context) {
    throw new Error('useFlightTicketContext must be used within FlightTicketContext.Provider');
  }
  return context;
};
