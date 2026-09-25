/**
 * AuthLayout — Full-screen dark/deep purple split layout for authentication
 *
 * Left side: Faculty Connect & IPS Academy branding + Outlet (Login/Register forms)
 * Right side: Academic collaboration vector illustration & feature highlights
 */

import { Outlet, Link } from 'react-router-dom';
import FacultyIllustration from '../components/ui/FacultyIllustration';
import ROUTES from '../constants/routes';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-[#0b051b] text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans relative">
      {/* Dynamic Ambient Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-900/25 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[450px] h-[450px] bg-indigo-900/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-purple-950/40 rounded-full blur-[150px]" />
      </div>

      {/* Main Split Grid Container */}
      <div className="relative z-10 min-h-screen w-full grid grid-cols-1 lg:grid-cols-12">
        
        {/* ── LEFT COLUMN: Branding & Form Content ── */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 xl:p-14 min-h-screen bg-slate-950/40 backdrop-blur-xl border-r border-white/5">
          
          {/* Header Branding Area */}
          <header className="mb-6 sm:mb-8">
            <Link to={ROUTES.LOGIN} className="inline-flex items-center gap-3.5 group focus:outline-none">
              {/* Faculty Connect Logo Icon */}
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-fuchsia-500 p-0.5 shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-[14px] bg-[#0f0728] flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </div>
              </div>

              {/* Brand Wordmark & Institution Tag */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-200 transition-colors">
                    Faculty Connect
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                    IPS Academy
                  </span>
                </div>
                <p className="text-xs text-purple-300/70 font-medium">
                  Connect. Collaborate. Communicate.
                </p>
              </div>
            </Link>
          </header>

          {/* Form Content (<Outlet />) */}
          <main className="my-auto py-4 w-full max-w-md mx-auto">
            <Outlet />
          </main>

          {/* Left Footer Info */}
          <footer className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-300/50 gap-2">
            <p>© {new Date().getFullYear()} IPS Academy — Faculty Connect</p>
            <div className="flex items-center gap-4 text-purple-300/60">
              <span className="hover:text-purple-300 transition-colors cursor-pointer">Security</span>
              <span>•</span>
              <span className="hover:text-purple-300 transition-colors cursor-pointer">Support</span>
              <span>•</span>
              <span className="hover:text-purple-300 transition-colors cursor-pointer">Privacy</span>
            </div>
          </footer>
        </div>

        {/* ── RIGHT COLUMN: Illustration & Feature Showcase ── */}
        <div className="hidden lg:block lg:col-span-6 xl:col-span-7 relative bg-gradient-to-br from-[#120731] via-[#1a0b45] to-[#0c051f]">
          <FacultyIllustration />
        </div>

      </div>
    </div>
  );
}
