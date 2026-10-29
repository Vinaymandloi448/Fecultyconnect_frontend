/**
 * Navbar component for Faculty Connect App Shell
 *
 * Top navigation bar featuring search, notification bell, user profile chip,
 * and mobile drawer toggle button.
 */

import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import ROUTES from '../../constants/routes';

export default function Navbar({ onMobileMenuToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Derive section title from route location
  const getPageTitle = () => {
    switch (location.pathname) {
      case ROUTES.DASHBOARD:
        return 'Faculty Workspace';
      case ROUTES.CHAT:
        return 'Messages & Faculty Chat';
      case ROUTES.GROUPS:
        return 'Academic & Department Groups';
      case ROUTES.ANNOUNCEMENTS:
        return 'Noticeboard & Circulars';
      case ROUTES.DOCUMENTS:
        return 'Document Exchange';
      case ROUTES.PROFILE:
        return 'Faculty Profile';
      default:
        return 'Faculty Connect';
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <header className="h-20 w-full bg-[#0b051b]/90 backdrop-blur-xl border-b border-purple-900/20 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      
      {/* ── Left Side: Mobile Menu Toggle & Page Title ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-xl border border-purple-500/20 bg-white/[0.04] text-purple-200 hover:text-white focus:outline-none"
          aria-label="Toggle Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>{getPageTitle()}</span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-semibold">
              <Sparkles className="w-3 h-3 text-purple-400" />
              IPS Academy
            </span>
          </h1>
          <span className="text-[11px] text-purple-300/60 hidden sm:block">
            Connected to official IPS Academy network
          </span>
        </div>
      </div>

      {/* ── Center: Search Bar ── */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-300/50">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search faculty members, groups, or announcements..."
            className="w-full rounded-xl border border-purple-500/20 bg-white/[0.04] pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-purple-300/40 transition-all focus:bg-white/[0.07] focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
        </div>
      </div>

      {/* ── Right Side: Notifications & User Avatar Dropdown ── */}
      <div className="flex items-center gap-3">
        
        {/* Search button on small screens */}
        <button className="md:hidden p-2 rounded-xl text-purple-200 hover:text-white hover:bg-white/[0.05]">
          <Search className="w-5 h-5" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileDropdownOpen(false);
            }}
            className="relative p-2 rounded-xl border border-purple-500/20 bg-white/[0.04] text-purple-200 hover:text-white hover:bg-white/[0.08] transition-colors focus:outline-none"
            aria-label="View Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-400 ring-2 ring-[#0b051b]" />
          </button>

          {/* Notifications Popover Menu */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0f0728] border border-purple-500/30 shadow-2xl p-4 z-50 animate-fadeIn space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-purple-900/30">
                <span className="text-xs font-bold text-white">Notifications</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                  3 New
                </span>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                <div className="p-2.5 rounded-xl bg-purple-900/20 border border-purple-500/20">
                  <div className="font-semibold text-purple-200">Department Meeting Scheduled</div>
                  <div className="text-[11px] text-purple-300/70">CSE Department meeting tomorrow at 11:00 AM</div>
                  <div className="text-[9px] text-purple-400 mt-1">10 mins ago</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="font-semibold text-slate-200">New Message from Dr. Sharma</div>
                  <div className="text-[11px] text-purple-300/60">&quot;Please review the course syllabus draft.&quot;</div>
                  <div className="text-[9px] text-purple-400 mt-1">1 hour ago</div>
                </div>
              </div>

              <Link
                to={ROUTES.ANNOUNCEMENTS}
                onClick={() => setNotificationsOpen(false)}
                className="block text-center text-xs font-semibold text-purple-300 hover:text-white pt-1"
              >
                View all announcements
              </Link>
            </div>
          )}
        </div>

        {/* User Profile Dropdown Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl border border-purple-500/20 bg-white/[0.04] hover:bg-white/[0.08] transition-all focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'F'}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">
                {user?.fullName || 'Faculty'}
              </span>
              <span className="text-[10px] text-purple-300/70">
                {user?.department || 'IPS Academy'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-purple-300/70" />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f0728] border border-purple-500/30 shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
              <div className="p-3 border-b border-purple-900/30">
                <p className="text-xs font-bold text-white">{user?.fullName}</p>
                <p className="text-[10px] text-purple-300/70 truncate">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {user?.designation || 'Faculty Member'}
                </span>
              </div>

              <Link
                to={ROUTES.PROFILE}
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-200 hover:text-white hover:bg-purple-900/40 transition-colors"
              >
                <User className="w-4 h-4 text-purple-400" />
                <span>My Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
