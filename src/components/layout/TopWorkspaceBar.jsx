/**
 * TopWorkspaceBar — Slack-style top navigation bar across the workspace
 *
 * Provides hamburger menu for mobile, global workspace search,
 * faculty availability status quick-switcher, and mock mode indicators.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search,
  Menu,
  Sparkles,
  HelpCircle,
  Bell,
  ChevronDown,
  Check,
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import { updateUserStatus } from '../../features/auth/authSlice';
import ROUTES from '../../constants/routes';

export default function TopWorkspaceBar({ onMobileMenuToggle }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isMockAuth } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const statusOptions = [
    { id: 'online', label: 'Active', color: 'bg-emerald-500' },
    { id: 'in_lecture', label: 'In Class / Lecture', color: 'bg-purple-500' },
    { id: 'research', label: 'Research / Quiet Hours', color: 'bg-blue-500' },
    { id: 'away', label: 'Away / Out of Office', color: 'bg-amber-400' },
  ];

  const handleSelectStatus = (statusId) => {
    dispatch(updateUserStatus({ status: statusId }));
    setStatusDropdownOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/dashboard/channels/general?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 select-none z-10 shadow-xs">
      
      {/* ── LEFT: Mobile hamburger & Workspace context ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle workspace navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-purple-700" />
          <span>Faculty Workspace</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 font-normal truncate max-w-[200px]">
            {user?.department || 'College of Engineering'}
          </span>
        </div>
      </div>

      {/* ── CENTER: Quick Search Input ── */}
      <form
        onSubmit={handleSearchSubmit}
        className={`relative transition-all duration-200 ${
          searchFocused ? 'w-full max-w-xl' : 'w-72 sm:w-80 md:w-96'
        }`}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search messages, channels, or faculty..."
            className="w-full pl-8 pr-12 py-1 rounded-lg bg-slate-100 border border-transparent hover:border-slate-300 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-xs text-slate-800 placeholder-slate-400 transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[10px] text-slate-400 font-mono">
            Ctrl+K
          </div>
        </div>
      </form>

      {/* ── RIGHT: Dev Mode & Availability Status ── */}
      <div className="flex items-center gap-3">
        {/* Mock Dev Mode Indicator */}
        {isMockAuth && (
          <div
            className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-semibold"
            title="Running in client-side mock development mode"
          >
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span>Dev Mock Mode</span>
          </div>
        )}

        {/* Notifications Icon link */}
        <button
          onClick={() => navigate(ROUTES.NOTIFICATIONS)}
          className="relative p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* Quick Status Dropdown */}
        <div className="relative">
          <button
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                user?.status === 'away'
                  ? 'bg-amber-400'
                  : user?.status === 'in_lecture'
                  ? 'bg-purple-500'
                  : 'bg-emerald-500'
              }`}
            />
            <span className="hidden sm:inline capitalize">
              {user?.status === 'in_lecture'
                ? 'In Lecture'
                : user?.status === 'away'
                ? 'Away'
                : 'Active'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {statusDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setStatusDropdownOpen(false)}
              />
              <div className="absolute right-0 top-9 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-slideDown">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Set Availability Status
                </div>
                {statusOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectStatus(opt.id)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-purple-50 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                      <span>{opt.label}</span>
                    </div>
                    {user?.status === opt.id && (
                      <Check className="w-3.5 h-3.5 text-purple-600" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User Mini Avatar */}
        <button
          onClick={() => navigate(ROUTES.PROFILE)}
          className="focus:outline-none"
          title="Go to Faculty Profile"
        >
          <Avatar
            name={user?.fullName || 'Faculty'}
            initials={user?.initials}
            status={user?.status}
            size="sm"
            rounded="lg"
            gradient={user?.avatarColor}
          />
        </button>
      </div>

    </header>
  );
}
