import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Business {
  id: string;
  name: string;
  businessName: string;
  type: string;
  status: string;
  modules?: string[];
}

interface BusinessContextType {
  business: Business | null;
  setBusiness: (business: Business | null) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [business, setBusinessState] = useState<Business | null>(null);

  useEffect(() => {
    const storedBusiness = localStorage.getItem('business');
    if (storedBusiness) {
      try {
        setBusinessState(JSON.parse(storedBusiness));
      } catch {
        localStorage.removeItem('business');
        setBusinessState(null);
      }
    }
  }, []);

  const setBusiness = (business: Business | null) => {
    if (business) {
      localStorage.setItem('business', JSON.stringify(business));
      setBusinessState(business);
    } else {
      localStorage.removeItem('business');
      setBusinessState(null);
    }
  };

  return (
    <BusinessContext.Provider value={{ business, setBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness(): BusinessContextType {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
