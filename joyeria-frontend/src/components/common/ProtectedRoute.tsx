import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isAdminOrEmployee } from '../../utils/jwtRole';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** JWT must have one of these roles. Default: Admin or Employee (admin panel). */
  allowedRoles?: readonly string[];
  /** Any authenticated user; redirects to login when missing token. */
  requireAuth?: boolean;
}

const DEFAULT_ADMIN_ROLES = ['Admin', 'Employee'] as const;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAuth,
}) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !role) {
    const loginTo = `/login?from=${encodeURIComponent(location.pathname + location.search)}`;
    if (requireAuth || allowedRoles) {
      return <Navigate to={loginTo} replace />;
    }
    return <Navigate to="/" replace />;
  }

  if (requireAuth && !allowedRoles) {
    return <>{children}</>;
  }

  const allowed = allowedRoles ?? DEFAULT_ADMIN_ROLES;
  if (!allowed.includes(role)) {
    if (allowedRoles && isAdminOrEmployee(role)) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
