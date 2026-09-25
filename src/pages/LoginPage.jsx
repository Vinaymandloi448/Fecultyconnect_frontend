/**
 * LoginPage — Redesigned Faculty Connect authentication interface
 *
 * Connected to real backend API (POST /api/auth/login with { email, password })
 * Preserves all Redux state, loading/error handling, and redirect behavior.
 */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { login, clearError } from '../features/auth/authSlice';
import ROUTES from '../constants/routes';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Where to redirect after login (default: dashboard)
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Title & Headline */}
      <div className="space-y-2 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-purple-200/70">
          Sign in with your IPS Academy credentials to access your faculty workspace.
        </p>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 flex items-start gap-3 text-red-200 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-semibold block text-red-300 mb-0.5">Authentication Failed</span>
            {error}
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="block text-xs font-semibold text-purple-200 uppercase tracking-wider">
            Faculty Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-300/60">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-purple-500/20 bg-white/[0.05] pl-10 pr-4 py-3 text-white placeholder-slate-400/60 text-sm transition-all focus:bg-white/[0.08] focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50"
              placeholder="faculty@ipsacademy.org"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="block text-xs font-semibold text-purple-200 uppercase tracking-wider">
              Password
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-300/60">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-purple-500/20 bg-white/[0.05] pl-10 pr-11 py-3 text-white placeholder-slate-400/60 text-sm transition-all focus:bg-white/[0.08] focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-purple-300/60 hover:text-purple-200 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-4 shadow-lg shadow-purple-900/40 transition-all transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register Link */}
      <div className="pt-2 text-center text-sm text-purple-200/70">
        Don&apos;t have a faculty account?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="font-semibold text-purple-300 hover:text-white underline underline-offset-4 decoration-purple-400/40 hover:decoration-purple-300 transition-all"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
