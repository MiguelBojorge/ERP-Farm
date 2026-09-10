import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, refreshSession, getRefreshToken, clearSession } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Mientras se intenta recuperar la sesion guardada no se decide si mostrar login o la app.
  const [cargando, setCargando] = useState(Boolean(getRefreshToken()));

  useEffect(() => {
    let activo = true;
    if (getRefreshToken()) {
      refreshSession()
        .then((u) => activo && setUser(u))
        .catch(() => activo && setUser(null))
        .finally(() => activo && setCargando(false));
    }
    return () => {
      activo = false;
    };
  }, []);

  // api.js avisa con este evento cuando ya no se pudo renovar la sesion.
  useEffect(() => {
    const alExpirar = () => setUser(null);
    window.addEventListener('auth:expired', alExpirar);
    return () => window.removeEventListener('auth:expired', alExpirar);
  }, []);

  const login = useCallback(async (username, password) => {
    const u = await loginRequest(username, password);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, cargando, login, logout }), [user, cargando, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
