import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  wallets: { currency: string; balance: number }[];
  kycStatus: string;
  accountNumber: string;
  accountStatus: 'ACTIVE' | 'INACTIVE';
  isTwoFactorEnabled?: boolean;
  country?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('lumina_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        } catch (error) {
          console.error('Session expired or invalid token');
          localStorage.removeItem('lumina_token');
          toast.error('Session expired', { description: 'Your session is invalid. Please log in again.' });
          if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
            window.location.href = '/login';
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('lumina_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('lumina_token');
    setUser(null);
    window.location.href = '/login'; // Or navigate
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (error) {
      console.error('Failed to refresh user data');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
