import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import StudentDashboardSkeleton from "../common/skeletons/StudentDashboardSkeleton";
import TeacherDashboardSkeleton from "../common/skeletons/TeacherDashboardSkeleton";
import AdminDashboardSkeleton from "../common/skeletons/AdminDashboardSkeleton";
import ProfileSkeleton from "../common/skeletons/ProfileSkeleton";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();
  const { isAuthenticated, authLoading, user, getDefaultRouteForRole } =
    useAuth();

  if (authLoading) {
    const path = location.pathname;
    if (path.startsWith("/student")) {
      return <StudentDashboardSkeleton />;
    }
    if (path.startsWith("/teacher")) {
      return <TeacherDashboardSkeleton />;
    }
    if (path.startsWith("/profile")) {
      return <ProfileSkeleton />;
    }
    return <AdminDashboardSkeleton />;
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
