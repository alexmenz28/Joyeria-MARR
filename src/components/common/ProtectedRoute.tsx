import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Si no está autenticado, redirige a la página de inicio de sesión
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Si está autenticado pero no tiene el rol permitido, redirige a una página de acceso denegado o al inicio
    return <Navigate to="/" replace />;
  }

  // Si está autenticado y tiene el rol correcto (o no se requieren roles específicos), renderiza el componente hijo
  return <Outlet />;
};

export default ProtectedRoute; 