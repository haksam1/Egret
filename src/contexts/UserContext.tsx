import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  businessId?: string;
  role: 'USER' | 'ADMIN';
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null | ((prev: User | null) => User | null)) => void;
  isAuthenticated: boolean;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        localStorage.removeItem('user');
        setUserState(null);
      }
    } else {
      setUserState(null);
    }
    setIsLoading(false);
  }, []);

  const setUser = (value: User | null | ((prev: User | null) => User | null)) => {
    setUserState((prev) => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      if (newValue) {
        localStorage.setItem('user', JSON.stringify(newValue));
      } else {
        localStorage.removeItem('user');
      }
      return newValue;
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated: !!user, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
