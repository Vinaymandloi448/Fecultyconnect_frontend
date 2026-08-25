/**
 * NotFoundPage — 404 fallback
 */

import { Link } from 'react-router-dom';
import ROUTES from '../constants/routes';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-center">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="mt-3 text-slate-400">The page you're looking for doesn't exist.</p>
      <Link
        to={ROUTES.DASHBOARD}
        className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
