/**
 * RegisterPage — FacultyConnect Registration Interface
 *
 * Route: /register
 * Supports real backend Spring Boot registration (POST /api/auth/register)
 * and development mock registration.
 */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Briefcase,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
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
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const departments = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Basic Sciences & Humanities',
    'Management Studies',
  ];

  const designations = [
    'Professor & HOD',
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Dean of Academics',
    'Director / Principal',
    'Lecturer',
  ];

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) {
      errs.fullName = 'Full name is required.';
    }

    if (!form.facultyId.trim()) {
      errs.facultyId = 'Institutional Faculty ID is required (e.g. FAC001).';
    }

    if (!form.email.trim()) {
      errs.email = 'College email is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Please provide a valid institutional email address.';
    }

    if (!form.password) {
      errs.password = 'Password is required.';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!form.agreeTerms) {
      errs.agreeTerms = 'You must accept the academic conduct terms.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validate()) return;

    const userData = {
      facultyId: form.facultyId.trim().toUpperCase(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      department: form.department,
      designation: form.designation,
      subjects: ['General Academic Courses'],
      profileImage: '',
      bio: `${form.designation} in ${form.department}`,
    };


    const result = await dispatch(register(userData));

    if (register.fulfilled.match(result)) {
      setRegisteredSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    }
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
          Create Faculty Account
        </h1>
        <p className="text-xs text-slate-500">
          Join your college faculty workspace to start collaborating across departments.
        </p>
      </div>

      {/* Success banner */}
      {registeredSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Account Created Successfully!</span>
            Redirecting to sign-in page...
          </div>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-bold block text-rose-800">Registration Notice</span>
            {error}
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 text-slate-800" noValidate>
        
        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="reg-fullName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="reg-fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="e.g. Dr. Jane Doe"
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                fieldErrors.fullName
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                  : 'border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100'
              }`}
              disabled={isLoading}
            />
          </div>
          {fieldErrors.fullName && (
            <p className="text-rose-600 text-[11px] font-medium">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Faculty Institutional ID */}
        <div className="space-y-1">
          <label htmlFor="reg-facultyId" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Faculty ID / Institutional ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <input
              id="reg-facultyId"
              name="facultyId"
              type="text"
              value={form.facultyId}
              onChange={handleChange}
              placeholder="e.g. FAC001, FAC002"
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                fieldErrors.facultyId
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                  : 'border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100'
              }`}
              disabled={isLoading}
            />
          </div>
          {fieldErrors.facultyId ? (
            <p className="text-rose-600 text-[11px] font-medium">{fieldErrors.facultyId}</p>
          ) : (
            <p className="text-[11px] text-slate-400">Your unique institutional ID used for peer conversations and groups.</p>
          )}
        </div>


        {/* College Email */}
        <div className="space-y-1">
          <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            College Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="reg-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. j.doe@facultyconnect.edu"
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

        {/* Department & Designation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="reg-department" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Department
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <select
                id="reg-department"
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:border-purple-600"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-designation" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Faculty Designation
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <select
                id="reg-designation"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:border-purple-600"
              >
                {designations.map((des) => (
                  <option key={des} value={des}>
                    {des}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-8 pr-8 py-2.5 rounded-xl border text-xs focus:outline-none ${
                  fieldErrors.password
                    ? 'border-rose-400 bg-rose-50/30'
                    : 'border-slate-300 focus:border-purple-600'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-rose-600 text-[10px]">{fieldErrors.password}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-confirmPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                id="reg-confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-8 pr-8 py-2.5 rounded-xl border text-xs focus:outline-none ${
                  fieldErrors.confirmPassword
                    ? 'border-rose-400 bg-rose-50/30'
                    : 'border-slate-300 focus:border-purple-600'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-rose-600 text-[10px]">{fieldErrors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="pt-1 space-y-1">
          <div className="flex items-start gap-2">
            <input
              id="agreeTerms"
              name="agreeTerms"
              type="checkbox"
              checked={form.agreeTerms}
              onChange={handleChange}
              className="w-4 h-4 mt-0.5 rounded text-purple-700 focus:ring-purple-500 border-slate-300"
            />
            <label htmlFor="agreeTerms" className="text-xs text-slate-600 leading-snug">
              I certify that I am an authorized college faculty member and agree to institutional academic conduct standards.
            </label>
          </div>
          {fieldErrors.agreeTerms && (
            <p className="text-rose-600 text-[11px] font-medium">{fieldErrors.agreeTerms}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md shadow-purple-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Creating faculty account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>

      {/* Switch to Login */}
      <div className="pt-2 text-center text-xs text-slate-500">
        Already have a faculty account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-bold text-purple-700 hover:text-purple-900 underline underline-offset-4"
        >
          Sign In.
        </Link>
      </div>

      {/* Institutional note */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed text-center">
        Note: Faculty accounts are reserved exclusively for college faculty members. Verification status will be finalized upon administrative credential check.
      </div>

    </div>
  );
}
