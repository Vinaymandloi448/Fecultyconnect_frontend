/**
 * LandingPage — Official FacultyConnect Platform Landing Page
 *
 * Route: /
 * Displays Slack-inspired SaaS landing page with product preview,
 * 6 feature cards, How It Works, and direct links to Login and Register.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  GraduationCap,
  MessageSquare,
  Users,
  FileText,
  Megaphone,
  Bell,
  ShieldCheck,
  ArrowRight,
  LogIn,
  UserPlus,
  Hash,
  Lock,
  Smile,
  Send,
  Download,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { loginWithMock } from '../features/auth/authSlice';
import { MOCK_CURRENT_USER } from '../data/mockData';
import ROUTES from '../constants/routes';

export default function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleQuickDemo = () => {
    dispatch(loginWithMock(MOCK_CURRENT_USER));
    navigate(ROUTES.DASHBOARD);
  };

  const features = [
    {
      id: 1,
      title: 'Real-Time Messaging',
      description:
        'Direct 1-on-1 chats and threaded discussions organized around subjects, courses, and department committees.',
      icon: MessageSquare,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      id: 2,
      title: 'Department & Subject Groups',
      description:
        'Organized channels for Computer Science, Examination Cell, Academic Council, and interdisciplinary research.',
      icon: Users,
      color: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 3,
      title: 'Secure Document Sharing',
      description:
        'Exchange course syllabus blueprints, lab manuals, invigilation duty rosters, and research grant drafts effortlessly.',
      icon: FileText,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 4,
      title: 'College Announcements',
      description:
        'Official administrative notices, Dean memos, NAAC compliance alerts, and circulars broadcast with priority tags.',
      icon: Megaphone,
      color: 'bg-rose-100 text-rose-700',
    },
    {
      id: 5,
      title: 'Instant Notifications',
      description:
        'Stay informed on urgent assessment deadlines, duty schedule updates, committee mentions, and shared files.',
      icon: Bell,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      id: 6,
      title: 'Faculty Profiles & Access Control',
      description:
        'Exclusive authentication reserved for verified college faculty members, preserving academic privacy and authenticity.',
      icon: ShieldCheck,
      color: 'bg-blue-100 text-blue-700',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Sign in with Authorized Credentials',
      description:
        'Access your secure faculty workspace using your verified college email and unique institutional faculty ID.',
    },
    {
      number: '02',
      title: 'Join Department & Subject Groups',
      description:
        'Connect with departmental peers, examination committees, and interdisciplinary teaching groups.',
    },
    {
      number: '03',
      title: 'Collaborate & Share Resources',
      description:
        'Exchange lecture materials, coordinate evaluation rosters, post urgent circulars, and keep communication organized.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1D1C1D] flex flex-col font-sans select-none antialiased">
      
      {/* ── 1. NAVIGATION BAR ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Wordmark */}
          <Link to={ROUTES.HOME} className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#350d36] to-[#4A154B] p-0.5 shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[10px] bg-[#3F0E40] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-purple-900 transition-colors">
                  FacultyConnect
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase tracking-wider hidden sm:inline-block">
                  Collegiate
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                College Faculty Communication Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#home" className="hover:text-purple-700 transition-colors">Home</a>
            <a href="#features" className="hover:text-purple-700 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-purple-700 transition-colors">How It Works</a>
            <a href="#about" className="hover:text-purple-700 transition-colors">About</a>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleQuickDemo}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs border border-purple-200 transition-all cursor-pointer"
              title="Instantly sign into dashboard demo"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Explore Demo</span>
            </button>

            {isAuthenticated ? (
              <Link
                to={ROUTES.DASHBOARD}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-sm transition-all"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 animate-slideDown">
            <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-purple-700"
              >
                Home
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-purple-700"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-purple-700"
              >
                How It Works
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-purple-700"
              >
                About
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleQuickDemo();
                }}
                className="w-full py-2.5 rounded-xl bg-purple-50 text-purple-700 font-semibold text-xs border border-purple-200 text-center"
              >
                ⚡ Explore Workspace Demo
              </button>

              {isAuthenticated ? (
                <Link
                  to={ROUTES.DASHBOARD}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-purple-700 text-white font-semibold text-xs text-center"
                >
                  Go to Workspace
                </Link>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-purple-700 text-white font-semibold text-xs text-center"
                  >
                    Get Started / Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── 2. HERO SECTION ── */}
      <section id="home" className="pt-12 sm:pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-12">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Dedicated College Faculty Workspace</span>
          </div>

          {/* Main Headline (Mandatory requirement from user prompt) */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Better Communication. Stronger Faculty Collaboration.
          </h1>

          {/* Supporting Text (Mandatory requirement) */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            One secure workspace for college faculty to communicate, collaborate, share academic resources, and stay connected.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to={ROUTES.REGISTER}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md shadow-purple-900/20 transition-all transform active:scale-95 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={ROUTES.LOGIN}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm transition-all"
            >
              <LogIn className="w-4 h-4 text-purple-700" />
              <span>Sign In</span>
            </Link>

            <button
              onClick={handleQuickDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-sm border border-purple-200 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Launch Live Workspace</span>
            </button>
          </div>

          {/* Trust points */}
          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Authorized Faculty Only</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Department Hubs</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Notifications</span>
            </span>
          </div>

        </div>

        {/* ── REALISTIC WORKSPACE PRODUCT PREVIEW (Built from UI components) ── */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
          
          {/* Mock Browser Header Bar */}
          <div className="h-10 bg-slate-100 border-b border-slate-200 px-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>

            <div className="px-6 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-mono text-slate-500 flex items-center gap-2">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>https://facultyconnect.college.edu/dashboard</span>
            </div>

            <div className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
              Faculty Workspace
            </div>
          </div>

          {/* Miniature Slack-inspired Workspace Layout */}
          <div className="h-[460px] flex overflow-hidden text-xs">
            
            {/* Rail (Mini) */}
            <div className="w-14 bg-[#350d36] flex flex-col items-center py-3 justify-between shrink-0">
              <div className="space-y-3 flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-[#3F0E40] border border-white/20 flex items-center justify-center text-white">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-lg text-[#D1C2D9] flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-lg text-[#D1C2D9] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
                RS
              </div>
            </div>

            {/* Sidebar (Mini) */}
            <div className="w-48 sm:w-56 bg-[#3F0E40] text-[#D1C2D9] p-3 flex flex-col justify-between shrink-0 border-r border-[#522653]">
              <div className="space-y-3">
                <div className="font-bold text-white text-xs border-b border-[#522653] pb-2 truncate">
                  FacultyConnect Workspace
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-purple-300/70 tracking-wider">
                    Channels
                  </div>
                  <div className="px-2 py-1 rounded bg-[#1164A3] text-white font-semibold flex items-center gap-1.5 truncate">
                    <Hash className="w-3 h-3" />
                    <span>computer-science</span>
                  </div>
                  <div className="px-2 py-1 rounded text-[#D1C2D9] hover:bg-white/10 flex items-center gap-1.5 truncate">
                    <Hash className="w-3 h-3" />
                    <span>general</span>
                  </div>
                  <div className="px-2 py-1 rounded text-[#D1C2D9] hover:bg-white/10 flex items-center gap-1.5 truncate">
                    <Hash className="w-3 h-3" />
                    <span>examination-updates</span>
                  </div>
                  <div className="px-2 py-1 rounded text-[#D1C2D9] hover:bg-white/10 flex items-center gap-1.5 truncate">
                    <Hash className="w-3 h-3" />
                    <span>faculty-resources</span>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="text-[10px] uppercase font-bold text-purple-300/70 tracking-wider">
                    Direct Messages
                  </div>
                  <div className="px-2 py-1 rounded text-[#D1C2D9] flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Dr. Priya Patel</span>
                  </div>
                  <div className="px-2 py-1 rounded text-[#D1C2D9] flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Prof. Vikram Malhotra</span>
                  </div>
                  <div className="px-2 py-1 rounded text-[#D1C2D9] flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Dr. Sunita Rao (Dean)</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-purple-300/50">
                🟢 142 Faculty Online
              </div>
            </div>

            {/* Chat Area (Mini) */}
            <div className="flex-1 bg-white flex flex-col justify-between overflow-hidden">
              {/* Header */}
              <div className="h-10 px-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Hash className="w-3.5 h-3.5 text-purple-700" />
                  <span>computer-science</span>
                  <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
                    CSE faculty syllabus & lab coordination
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  28 Members
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-slate-50/30">
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    RS
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Dr. Rajesh Sharma</span>
                      <span className="text-[9px] text-purple-700 bg-purple-50 px-1 rounded">HOD CSE</span>
                      <span className="text-[10px] text-slate-400">10:45 AM</span>
                    </div>
                    <p className="text-slate-700">
                      Colleagues, please verify the updated NEP syllabus mapping for 6th semester courses.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-fuchsia-600 to-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    PP
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Dr. Priya Patel</span>
                      <span className="text-[9px] text-purple-700 bg-purple-50 px-1 rounded">Associate Prof</span>
                      <span className="text-[10px] text-slate-400">11:02 AM</span>
                    </div>
                    <p className="text-slate-700">
                      Uploaded the revised Distributed Systems and AI lab manual with Docker practicals:
                    </p>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-3 max-w-xs shadow-2xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">CSE_602_Lab_Manual_2025.pdf</span>
                      </div>
                      <Download className="w-3 h-3 text-slate-400 shrink-0" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-bold">👍 5</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">🚀 3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Composer */}
              <div className="p-2.5 border-t border-slate-200 bg-white flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="Message #computer-science..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-400 bg-slate-50 cursor-default"
                />
                <button
                  onClick={handleQuickDemo}
                  className="p-1.5 rounded-lg bg-purple-700 text-white"
                  title="Try sending messages in demo"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ── 3. FEATURES SECTION (6 Cards) ── */}
      <section id="features" className="py-20 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
              Platform Features
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineered Exclusively for Academic Collaboration
            </h2>
            <p className="text-sm text-slate-600">
              Unlike generic chat apps, FacultyConnect organizes collegiate workflows around departments, subjects, duty rosters, and verified faculty identities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  className="p-6 rounded-2xl bg-[#F8F9FA] border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-800 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 4. HOW IT WORKS SECTION ── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
              Simple 3-Step Onboarding
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How FacultyConnect Works
            </h2>
            <p className="text-sm text-slate-600">
              Get started in minutes and connect with your entire faculty department network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs relative space-y-4"
              >
                <div className="text-3xl font-black text-purple-200">
                  {step.number}
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 5. INSTITUTIONAL CALL TO ACTION ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="rounded-3xl bg-gradient-to-r from-[#350d36] via-[#3F0E40] to-[#522653] text-white p-8 sm:p-12 shadow-xl space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to streamline your collegiate faculty communication?
          </h2>
          <p className="text-sm text-purple-200 max-w-xl mx-auto">
            Join hundreds of professors, HODs, and academic leaders coordinating courses, exams, and research in one unified workspace.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={ROUTES.REGISTER}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white text-purple-900 hover:bg-purple-50 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Create Faculty Account
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="w-full sm:w-auto px-7 py-3 rounded-xl border border-white/30 hover:bg-white/10 text-white font-bold text-xs transition-all"
            >
              Sign In to Workspace
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. FOOTER ── */}
      <footer id="about" className="mt-auto bg-white border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#3F0E40] flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900">
                FacultyConnect
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              FacultyConnect is the secure, real-time academic communication and collaboration platform exclusively designed for college professors, HODs, and academic staff.
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Platform Links
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#features" className="hover:text-purple-700 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-purple-700 transition-colors">How It Works</a></li>
              <li><Link to={ROUTES.LOGIN} className="hover:text-purple-700 transition-colors">Faculty Login</Link></li>
              <li><Link to={ROUTES.REGISTER} className="hover:text-purple-700 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Institutional Compliance */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Institutional Security
            </h4>
            <p className="text-xs text-slate-500">
              Encrypted collegiate messaging, verified institutional faculty credentials, and role-based department access.
            </p>
          </div>

        </div>

        {/* Bottom Notice */}
        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <p>© {new Date().getFullYear()} FacultyConnect Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-purple-700 transition-colors cursor-pointer">Academic Privacy</span>
            <span>•</span>
            <span className="hover:text-purple-700 transition-colors cursor-pointer">Security Protocol</span>
            <span>•</span>
            <span className="hover:text-purple-700 transition-colors cursor-pointer">Faculty Support</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
