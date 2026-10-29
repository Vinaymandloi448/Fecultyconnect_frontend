/**
 * NotFoundPage — 404 Fallback Page
 */

import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, LayoutDashboard } from 'lucide-react';
import ROUTES from '../constants/routes';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1D1C1D] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <div className="w-16 h-16 rounded-2xl bg-[#3F0E40] text-white flex items-center justify-center mb-6 shadow-md">
        <GraduationCap className="w-8 h-8" />
      </div>

      <span className="text-sm font-bold text-purple-700 tracking-wider uppercase mb-1">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
        Workspace Destination Not Found
      </h1>
      <p className="mt-3 text-sm text-slate-500 max-w-md">
        The channel, direct message, or faculty page you are searching for does not exist or has been relocated.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          to={ROUTES.DASHBOARD}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-all"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to Workspace Home</span>
        </Link>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>
      </div>
    </div>
  );
}
