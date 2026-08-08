import { Navigate, Outlet } from "react-router-dom";
import LoadingAnimation from "../common/LoadingAnimation";
import { useAuth } from "../../contexts/AuthContext";

const PublicOnlyRoute = () => {
  const { isAuthenticated, authLoading, user, getDefaultRouteForRole } =
    useAuth();

  if (authLoading) {
    return <LoadingAnimation />;
  }

  if (isAuthenticated) {
    return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
