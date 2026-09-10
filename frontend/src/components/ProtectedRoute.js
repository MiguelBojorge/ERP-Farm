import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protege rutas: sin sesion redirige a /login (recordando a donde iba) y, si se
 * indican `roles`, bloquea a los demas. La verificacion real siempre ocurre en el
 * servidor; esto solo evita mostrar pantallas que de todos modos darian 403.
 */
export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(user.rol)) return <Navigate to="/dashboard" replace />;
  return children;
}
