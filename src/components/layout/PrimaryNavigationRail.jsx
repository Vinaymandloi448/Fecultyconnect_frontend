/**
 * PrimaryNavigationRail — Slack-inspired narrow rail on the far left
 *
 * Provides high-level navigation between Workspace Home, DMs,
 * Announcements, Files, Notifications, and Profile.
 */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  MessageSquare,
  Megaphone,
  FileText,
  Bell,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice';
import Avatar from '../ui/Avatar';
import ROUTES from '../../constants/routes';

export default function PrimaryNavigationRail() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isMockAuth } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const { conversations, activeConversationId } = useSelector((state) => state.chat);

  const defaultDmPath = (() => {
    if (activeConversationId && activeConversationId.startsWith('CONV-')) {
      return ROUTES.messageUrl(activeConversationId);
    }
    const firstConv = conversations?.find((c) => c.conversationId?.startsWith('CONV-'))?.conversationId;
    return firstConv ? ROUTES.messageUrl(firstConv) : '/dashboard/messages';
  })();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      path: ROUTES.DASHBOARD,
      icon: LayoutDashboard,
      isActive: location.pathname === ROUTES.DASHBOARD,
    },
    {
      id: 'groups',
      label: 'Groups',
      path: ROUTES.GROUPS,
      icon: Users,
      isActive: location.pathname.startsWith(ROUTES.GROUPS),
    },
    {
      id: 'dms',
      label: 'DMs',
      path: defaultDmPath,
      icon: MessageSquare,
      isActive: location.pathname.startsWith('/dashboard/messages'),
    },

    {
      id: 'announcements',
      label: 'Notices',
      path: ROUTES.ANNOUNCEMENTS,
      icon: Megaphone,
      isActive: location.pathname.startsWith(ROUTES.ANNOUNCEMENTS),
    },
    {
      id: 'files',
      label: 'Files',
      path: ROUTES.FILES,
      icon: FileText,
      isActive: location.pathname.startsWith(ROUTES.FILES),
    },
    {
      id: 'notifications',
      label: 'Activity',
      path: ROUTES.NOTIFICATIONS,
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
      isActive: location.pathname.startsWith(ROUTES.NOTIFICATIONS),
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <aside className="w-[68px] bg-[#350d36] border-r border-[#4A154B]/60 flex flex-col items-center justify-between py-3 shrink-0 select-none z-30">
      
      {/* ── TOP: Workspace Icon & Nav Items ── */}
      <div className="flex flex-col items-center w-full space-y-3">
        {/* Workspace Brand Tile */}
        <Link
          to={ROUTES.DASHBOARD}
          className="relative group p-1 focus:outline-none"
          title="FacultyConnect Workspace"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-fuchsia-500 p-0.5 shadow-md shadow-black/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-[10px] bg-[#3F0E40] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#350d36]" />
        </Link>

        {/* Separator */}
        <div className="w-8 h-[1px] bg-white/10 my-1" />

        {/* Primary Navigation Icons */}
        <nav className="flex flex-col items-center w-full space-y-1.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl text-center group transition-all duration-150 ${
                  active
                    ? 'bg-white/20 text-white font-semibold shadow-inner'
                    : 'text-[#D1C2D9] hover:bg-white/10 hover:text-white'
                }`}
                title={item.label}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── BOTTOM: Mock Dev Tag, Profile & Logout ── */}
      <div className="flex flex-col items-center w-full space-y-2 pt-2 border-t border-white/10">
        
        {/* Mock Auth Badge Indicator */}
        {isMockAuth && (
          <div
            className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-200 border border-purple-400/30 flex items-center justify-center cursor-help"
            title="Development Mode: Authenticated with mock memory data"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          </div>
        )}

        {/* Profile Avatar Trigger */}
        <Link
          to={ROUTES.PROFILE}
          className={`relative group p-0.5 rounded-xl transition-all ${
            location.pathname === ROUTES.PROFILE
              ? 'ring-2 ring-white'
              : 'hover:ring-1 hover:ring-purple-300'
          }`}
          title={`${user?.fullName || 'Faculty Profile'} (${user?.designation || 'Faculty'})`}
        >
          <Avatar
            name={user?.fullName || 'Faculty'}
            initials={user?.initials}
            status={user?.status || 'online'}
            size="sm"
            rounded="lg"
            gradient={user?.avatarColor}
          />
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#D1C2D9] hover:text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer focus:outline-none"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

    </aside>
  );
}
