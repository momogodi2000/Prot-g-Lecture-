import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../common/Loader';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen size="xl" text="Chargement..." />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
};

export default PrivateRoute;

