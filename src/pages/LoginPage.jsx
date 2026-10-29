/**
 * LoginPage — FacultyConnect Authentication Interface
 *
 * Route: /login
 * Supports real backend Spring Boot login (POST /api/auth/login)
 * and seamless development mock login fallback.
 */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowLeft,
  GraduationCap,
} from 'lucide-react';
import { login, loginWithMock, clearError } from '../features/auth/authSlice';
import { MOCK_CURRENT_USER, MOCK_FACULTY_MEMBERS } from '../data/mockData';
import ROUTES from '../constants/routes';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Faculty email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validate()) return;

    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  // Quick Demo Login helper
  const handleQuickDemoLogin = (faculty) => {
    dispatch(loginWithMock(faculty));
    navigate(from, { replace: true });
  };

  return (
    <div className="w-full space-y-6 select-none">
      
      {/* Mobile brand header */}
      <div className="lg:hidden flex items-center justify-between pb-4 border-b border-slate-200">
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#3F0E40] flex items-center justify-center text-white">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-bold text-base text-slate-900">FacultyConnect</span>
        </Link>
        <Link to={ROUTES.HOME} className="text-xs text-purple-700 font-semibold">
          Back to Home
        </Link>
      </div>

      {/* Back button (desktop) */}
      <div className="hidden lg:block">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </Link>
      </div>

      {/* Heading */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Sign in to FacultyConnect
        </h1>
        <p className="text-xs text-slate-500">
          Enter your authorized college faculty credentials to access your workspace.
        </p>
      </div>

      {/* Global Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-bold block text-rose-800">Sign-in Notice</span>
            {error}
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-800" noValidate>
        
        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Faculty Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
              }}
              placeholder="e.g. r.sharma@facultyconnect.edu"
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                fieldErrors.email
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                  : 'border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100'
              }`}
              disabled={isLoading}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-rose-600 text-[11px] font-medium">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <button
              type="button"
              onClick={() => alert('Password reset link would be dispatched to your authorized college email address.')}
              className="text-[11px] text-purple-700 hover:text-purple-900 font-semibold transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
              }}
              placeholder="••••••••"
              className={`w-full pl-9 pr-11 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                fieldErrors.password
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                  : 'border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100'
              }`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-rose-600 text-[11px] font-medium">{fieldErrors.password}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2 pt-0.5">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded text-purple-700 focus:ring-purple-500 border-slate-300"
          />
          <label htmlFor="remember-me" className="text-xs text-slate-600">
            Remember this browser session
          </label>
        </div>

        {/* Primary Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md shadow-purple-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Verifying credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>

      {/* Switch to Register */}
      <div className="pt-2 text-center text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="font-bold text-purple-700 hover:text-purple-900 underline underline-offset-4"
        >
          Create one.
        </Link>
      </div>

      {/* ── QUICK DEMO LOGIN SHORTCUT BOX ── */}
      <div className="pt-4 border-t border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Quick Demo Access (Instant)</span>
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin(MOCK_CURRENT_USER)}
            className="p-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-left transition-colors cursor-pointer"
          >
            <div className="text-xs font-bold text-purple-900 truncate">
              Dr. Rajesh Sharma
            </div>
            <div className="text-[10px] text-purple-700 truncate">
              Professor & HOD, CSE
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin(MOCK_FACULTY_MEMBERS[1])}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors cursor-pointer"
          >
            <div className="text-xs font-bold text-slate-900 truncate">
              Dr. Priya Patel
            </div>
            <div className="text-[10px] text-slate-600 truncate">
              Associate Professor
            </div>
          </button>
        </div>
      </div>

    </div>
  );
}
