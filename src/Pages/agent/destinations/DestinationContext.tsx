import { createContext, useContext } from 'react';

type DestinationContextType = {
  reloadDestinations: () => Promise<void>;
};

export const DestinationContext = createContext<DestinationContextType | null>(null);

export const useDestinationContext = () => {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error('useDestinationContext must be used within DestinationContext.Provider');
  }
  return context;
};
