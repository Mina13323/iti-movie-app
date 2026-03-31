import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

/**
 * ProtectedRoute component
 * Wraps private routes and redirects to /login if unauthenticated.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // back to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * AuthRoute component
 * Prevents logged-in users from accessing login/signup pages.
 */
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated) {
    // If logged in, redirect away from login/signup pages
    return <Navigate to="/" replace />;
  }

  return children;
}
