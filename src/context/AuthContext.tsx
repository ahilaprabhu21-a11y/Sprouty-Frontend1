import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../lib/api';
import type { User } from '../lib/types';

interface AuthCtx {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  headline?: string;
  categories?: string;
  location?: string;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('sprouty_token');
    const u = localStorage.getItem('sprouty_user');
    if (t && u) {
      setToken(t);
      try { setUser(JSON.parse(u)); } catch {}
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data.token, data.user);
  }

  async function signup(d: SignupData) {
    const { data } = await api.post('/auth/signup', d);
    persist(data.token, data.user);
  }

  function persist(t: string, u: User) {
    localStorage.setItem('sprouty_token', t);
    localStorage.setItem('sprouty_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  }

  function logout() {
    localStorage.removeItem('sprouty_token');
    localStorage.removeItem('sprouty_user');
    setToken(null);
    setUser(null);
  }

  async function refresh() {
    const { data } = await api.get('/users/me');
    setUser(data);
    localStorage.setItem('sprouty_user', JSON.stringify(data));
  }

  return (
    <Ctx.Provider value={{ user, token, loading, login, signup, logout, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be inside AuthProvider');
  return c;
}
