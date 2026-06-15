import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getJwtRole } from '../utils/jwtRole';
import { setUnauthorizedHandler } from '../utils/api';

const TOKEN_KEY = 'token';

type AuthContextValue = {
  token: string | null;
  role: string | undefined;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readRoleFromToken(token: string): string | undefined {
  try {
    const decoded = jwtDecode<Record<string, unknown> & { exp?: number }>(token);
    if (decoded.exp != null && decoded.exp * 1000 < Date.now()) return undefined;
    return getJwtRole(decoded);
  } catch {
    return undefined;
  }
}

function loadStoredToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  if (!readRoleFromToken(token)) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
  return token;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => loadStoredToken());

  const role = useMemo(() => (token ? readRoleFromToken(token) : undefined), [token]);
  const isAuthenticated = !!token && !!role;

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const login = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      const from = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.assign(`/login?from=${from}`);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const value = useMemo(
    () => ({ token, role, isAuthenticated, login, logout }),
    [token, role, isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
