/**
 * ProtectedRoute — guards routes that require authentication
 *
 * If the user is not authenticated, redirects to /login.
 * Preserves the intended destination so they can be redirected back after login.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ROUTES from '../../constants/routes';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  // While checking auth status (e.g., loadUser in progress), show nothing
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    // Redirect to login, passing the current location for post-login redirect
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
