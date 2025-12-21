import { createContext, useContext } from 'react';

type ConsultationContextType = {
  reloadConsultations: () => Promise<void>;
};

export const ConsultationContext = createContext<ConsultationContextType | null>(null);

export const useConsultationContext = () => {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error('useConsultationContext must be used within ConsultationContext.Provider');
  }
  return context;
};
