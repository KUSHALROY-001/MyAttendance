import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingAnimation from "../common/LoadingAnimation";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();
  const { isAuthenticated, authLoading, user, getDefaultRouteForRole } =
    useAuth();

  if (authLoading) {
    return <LoadingAnimation />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
