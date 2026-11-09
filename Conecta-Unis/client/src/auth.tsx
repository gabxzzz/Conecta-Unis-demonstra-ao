import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { api, tokenStore } from './api';
import type { AuthResponse, Company, User } from './types';

interface AuthContextValue {
  user: User | null;
  company: Company | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (payload: Record<string, unknown>) => Promise<AuthResponse>;
  logout: () => void;
  refresh: () => Promise<void>;
  setUser: (user: User | null) => void;
  setCompany: (company: Company | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get<{ user: User; company: Company | null }>('/auth/me')
      .then((response) => {
        setUser(response.user);
        setCompany(response.company);
      })
      .catch(() => {
        tokenStore.clear();
        setUser(null);
        setCompany(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    tokenStore.set(response.token);
    setUser(response.user);
    setCompany(response.company);
    return response;
  }, []);

  const register = useCallback(async (payload: Record<string, unknown>) => {
    const response = await api.post<AuthResponse>('/auth/register', payload);
    tokenStore.set(response.token);
    setUser(response.user);
    setCompany(response.company);
    return response;
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setCompany(null);
  }, []);

  const refresh = useCallback(async () => {
    const response = await api.get<{ user: User; company: Company | null }>('/auth/me');
    setUser(response.user);
    setCompany(response.company);
  }, []);

  const value = useMemo(
    () => ({
      user,
      company,
      loading,
      login,
      register,
      logout,
      refresh,
      setUser,
      setCompany
    }),
    [user, company, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}

export function homeForRole(role?: string) {
  if (role === 'company') return '/empresa';
  if (role === 'admin') return '/admin';
  return '/app';
}
