import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getJwtRole, isAdminOrEmployee } from '../../utils/jwtRole';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Si se indica, el JWT debe tener uno de estos roles. Por defecto: Admin o Employee. */
  allowedRoles?: readonly string[];
}

const DEFAULT_ADMIN_ROLES = ['Admin', 'Employee'] as const;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  try {
    const decoded = jwtDecode<Record<string, unknown>>(token);
    const role = getJwtRole(decoded);
    const allowed = allowedRoles ?? DEFAULT_ADMIN_ROLES;
    if (!role || !allowed.includes(role)) {
      if (allowedRoles && isAdminOrEmployee(role)) {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
