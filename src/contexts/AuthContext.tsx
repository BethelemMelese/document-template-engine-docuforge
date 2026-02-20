import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, type User } from '../api/endpoints';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'letterforge_token';
const USER_KEY = 'letterforge_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const persistAuth = useCallback((u: User | null, t: string | null) => {
    setUser(u);
    setToken(t);
    if (t) {
      localStorage.setItem(TOKEN_KEY, t);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    if (u) {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((u) => {
        persistAuth(u, token);
      })
      .catch(() => {
        persistAuth(null, null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, persistAuth]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login(email, password);
      persistAuth(res.user, res.token);
    },
    [persistAuth]
  );

  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      const res = await authApi.register(email, password, name);
      persistAuth(res.user, res.token);
    },
    [persistAuth]
  );

  const logout = useCallback(() => {
    persistAuth(null, null);
  }, [persistAuth]);

  const value: AuthContextValue = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
