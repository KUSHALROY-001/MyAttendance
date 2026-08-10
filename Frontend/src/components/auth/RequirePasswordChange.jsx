import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Sits just inside ProtectedRoute for every role's routes. If the account
// still has to change its default password (mustChangePassword — see the
// backend requirePasswordChange middleware for the actual enforcement),
// this redirects to the dedicated change-password page instead of letting
// the user reach their dashboard. This is a UX nicety, not the security
// boundary — the backend blocks the underlying API routes regardless of
// whether the user ever hits this component.
const RequirePasswordChange = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (user?.mustChangePassword && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }

  return <Outlet />;
};

export default RequirePasswordChange;
