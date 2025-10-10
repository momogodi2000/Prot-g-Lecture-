import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RoleGuard = ({ children, requiredRole, module, action }) => {
  const { currentAdmin, isSuperAdmin, hasPrivilege } = useAuth();

  // Check role-based access
  if (requiredRole && currentAdmin?.role !== requiredRole && !isSuperAdmin()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Check privilege-based access
  if (module && action && !hasPrivilege(module, action) && !isSuperAdmin()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default RoleGuard;

