/**
 * Sidebar component for Faculty Connect App Shell
 *
 * Provides primary navigation for authenticated faculty members.
 * Supports desktop sidebar, tablet compact mode, and mobile slide-out drawer.
 */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Users,
  Megaphone,
  FileText,
  User,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import ROUTES from '../../constants/routes';

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Messages', path: ROUTES.CHAT, icon: MessageSquare },
    { label: 'Groups', path: ROUTES.GROUPS, icon: Users },
    { label: 'Announcements', path: ROUTES.ANNOUNCEMENTS, icon: Megaphone },
    { label: 'Documents', path: ROUTES.DOCUMENTS, icon: FileText },
    { label: 'Profile', path: ROUTES.PROFILE, icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const isActive = (path) => {
    if (path === ROUTES.DASHBOARD) {
      return location.pathname === ROUTES.DASHBOARD;
    }
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0d0622] border-r border-purple-900/20 text-slate-200">
      
      {/* ── Brand Logo Header ── */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-purple-900/20">
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-3 group focus:outline-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-fuchsia-500 p-0.5 shadow-md shadow-purple-900/40 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-[10px] bg-[#0f0728] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-purple-200 transition-colors">
                Faculty Connect
              </span>
            </div>
            <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest">
              IPS Academy
            </span>
          </div>
        </Link>

        {/* Mobile Close Button */}
        {mobileOpen && (
          <button
            onClick={onMobileClose}
            className="md:hidden p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── Current Faculty Quick Card ── */}
      <div className="p-4 mx-3 my-4 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
          {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'F'}
        </div>
        <div className="overflow-hidden min-w-0 flex-1">
          <h4 className="text-xs font-bold text-white truncate">
            {user?.fullName || 'Faculty Member'}
          </h4>
          <p className="text-[11px] text-purple-300/70 truncate">
            {user?.department || user?.designation || 'IPS Academy Faculty'}
          </p>
        </div>
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto py-2">
        <div className="px-3 pb-2 text-[10px] font-bold text-purple-400 uppercase tracking-wider">
          Main Menu
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => onMobileClose && onMobileClose()}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                active
                  ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 border border-purple-500/40 text-white shadow-sm'
                  : 'text-purple-200/70 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    active ? 'text-purple-300' : 'text-purple-400/60 group-hover:text-purple-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {active && <ChevronRight className="w-3.5 h-3.5 text-purple-300" />}
            </Link>
          );
        })}
      </nav>

      {/* ── Sidebar Footer / Logout Button ── */}
      <div className="p-4 border-t border-purple-900/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-300/80 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-red-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </div>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer with Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-fadeIn">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
