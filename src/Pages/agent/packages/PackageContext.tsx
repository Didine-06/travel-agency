import { createContext, useContext } from 'react';

type PackageContextType = {
  reloadPackages: () => Promise<void>;
};

export const PackageContext = createContext<PackageContextType | null>(null);

export const usePackageContext = () => {
  const context = useContext(PackageContext);
  if (!context) {
    throw new Error('usePackageContext must be used within PackageContext.Provider');
  }
  return context;
};
