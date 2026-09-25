/**
 * RegisterPage — Redesigned Faculty Connect registration interface
 *
 * Connected to real backend API (POST /api/auth/register with faculty details)
 * Matches the deep purple, icon-enhanced design system of LoginPage.
 */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  IdCard,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Briefcase,
  BookOpen,
  FileText,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { register, clearError } from '../features/auth/authSlice';
import ROUTES from '../constants/routes';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    facultyId: '',
    fullName: '',
    email: '',
    password: '',
    department: '',
    designation: '',
    subjects: '',
    bio: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    // Convert comma-separated subjects string to array
    const userData = {
      ...form,
      subjects: form.subjects
        ? form.subjects.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      profileImage: '',
    };

    const result = await dispatch(register(userData));

    if (register.fulfilled.match(result)) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Title & Headline */}
      <div className="space-y-1.5 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create Faculty Profile
        </h1>
        <p className="text-xs sm:text-sm text-purple-200/70">
          Join the IPS Academy Faculty Connect portal to start collaborating.
        </p>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 flex items-start gap-3 text-red-200 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-semibold block text-red-300 mb-0.5">Registration Failed</span>
            {error}
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Row 1: Faculty ID & Full Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label htmlFor="reg-facultyId" className="block text-xs font-semibold text-purple-200 uppercase tracking-wider">
              Faculty ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-300/60">
                <IdCard className="w-3.5 h-3.5" />
              </div>
              <input
                id="reg-facultyId"
                name="facultyId"
                type="text"
                required
                value={form.facultyId}
                onChange={handleChange}
                className="w-full rounded-xl border border-purple-500/20 bg-white/[0.05] pl-9 pr-3 py-2.5 text-white placeholder-slate-400/60 text-xs sm:text-sm transition-all focus:bg-white/[0.08] focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50"
                placeholder="FAC001"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-fullName" className="block text-xs font-semibold text-purple-200 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-300/60">
                <User className="w-3.5 h-3.5" />
              </div>
              <input
                id="reg-fullName"
                name="fullName"
                type="text"
                required
                value={form.fullName}
                onChange={handleChange}
                className="w-full rounded-xl border border-purple-500/20 bg-white/[0.05] pl-9 pr-3 py-2.5 text-white placeholder-slate-400/60 text-xs sm:text-sm transition-all focus:bg-white/[0.08] focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50"
                placeholder="Dr. Jane Doe"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Email */}
        <div className="space-y-1">
          <label htmlFor="reg-email" className="block text-xs font-semibold text-purple-200 uppercase tracking-wider">
            Institutional Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-300/60">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <input
              id="reg-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-purple-500/20 bg-white/[0.05] pl-9 pr-3 py-2.5 text-white placeholder-slate-400/60 text-xs sm:text-sm transition-all focus:bg-white/[0.08] focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50"
              placeholder="faculty@ipsacademy.org"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Row 3: Password */}
        <div className="space-y-1">
          <label htmlFor="reg-password" className="block text-xs font-semibold text-purple-200 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-300/60">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <input
              id="reg-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-purple-500/20 bg-white/[0.05] pl-9 pr-10 py-2.5 text-white placeholder-slate-400/60 text-xs sm:text-sm transition-all focus:bg-white/[0.08] focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-300/60 hover:text-purple-200 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Row 4: Department & Designation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label htmlFor="reg-department" className="block text-xs font-semibold text-purple-200 uppercase tracking-wider">
              Department
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-300/60">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <input
                id="reg-department"
                name="department"
                type="text"
                required
                value={form.department}
                onChange={handleChange}
                className="w-full rounded-xl border border-purple-500/20 bg-white/[0.05] pl-9 pr-3 py-2.5 text-white placeholder-slate-400/60 text-xs sm:text-sm transition-all focus:bg-white/[0.08] focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50"
                placeholder="Computer Science"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-designation" className="block text-xs font-semibold text-purple-200 uppercase tracking-wider">
              Designation
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-300/60">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <input
                id="reg-designation"
                name="designation"
                type="text"
                required
                value={form.designation}
                onChange={handleChange}
                className="w-full rounded-xl border border-purple-500/20 bg-white/[0.05] pl-9 pr-3 py-2.5 text-white placeholder-slate-400/60 text-xs sm:text-sm transition-all focus:bg-white/[0.08] focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50"
                placeholder="Associate Professor"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Row 5: Subjects */}
        <div className="space-y-1">
          <label htmlFor="reg-subjects" className="block text-xs font-semibold text-purple-200 uppercase tracking-wider">
            Teaching Subjects <span className="text-purple-300/50 text-[10px] lowercase">(comma separated)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-300/60">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <input
              id="reg-subjects"
              name="subjects"
              type="text"
              value={form.subjects}
              onChange={handleChange}
              className="w-full rounded-xl border border-purple-500/20 bg-white/[0.05] pl-9 pr-3 py-2.5 text-white placeholder-slate-400/60 text-xs sm:text-sm transition-all focus:bg-white/[0.08] focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50"
              placeholder="Data Structures, DBMS, Java"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Row 6: Bio */}
        <div className="space-y-1">
          <label htmlFor="reg-bio" className="block text-xs font-semibold text-purple-200 uppercase tracking-wider">
            Bio <span className="text-purple-300/50 text-[10px] lowercase">(optional)</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none text-purple-300/60">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <textarea
              id="reg-bio"
              name="bio"
              rows={2}
              value={form.bio}
              onChange={handleChange}
              className="w-full rounded-xl border border-purple-500/20 bg-white/[0.05] pl-9 pr-3 py-2 text-white placeholder-slate-400/60 text-xs sm:text-sm transition-all focus:bg-white/[0.08] focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50 resize-none"
              placeholder="Brief professional background or research interests..."
              disabled={isLoading}
            />
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
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login Link */}
      <div className="pt-1 text-center text-sm text-purple-200/70">
        Already have a faculty account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-semibold text-purple-300 hover:text-white underline underline-offset-4 decoration-purple-400/40 hover:decoration-purple-300 transition-all"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
