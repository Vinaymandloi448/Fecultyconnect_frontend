/**
 * ProtectedRoute — guards routes that require authentication
 *
 * If the user is not authenticated, redirects to /login.
 * Preserves the intended destination so they can be redirected back after login.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import ROUTES from '../../constants/routes';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  // While checking auth status (e.g., loadUser in progress), keep protected pages in loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
        <span className="text-xs font-semibold tracking-wide text-slate-700">
          Verifying faculty session...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, passing the current location for post-login redirect
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
