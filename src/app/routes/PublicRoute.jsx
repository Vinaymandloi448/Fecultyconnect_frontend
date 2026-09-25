/**
 * PublicRoute — guards auth pages (login, register) from authenticated users
 *
 * If the user is already authenticated, redirects to /dashboard.
 * Prevents logged-in users from seeing the login/register forms.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ROUTES from '../../constants/routes';

export default function PublicRoute() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // While checking auth status, show nothing
  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
