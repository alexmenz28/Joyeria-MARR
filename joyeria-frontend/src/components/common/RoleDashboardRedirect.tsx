import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isAdminOrEmployee } from '../../utils/jwtRole';

/** Legacy /dashboard URL — only staff may reach the admin panel. */
export default function RoleDashboardRedirect() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login?from=/dashboard" replace />;
  }

  if (isAdminOrEmployee(role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/" replace />;
}
