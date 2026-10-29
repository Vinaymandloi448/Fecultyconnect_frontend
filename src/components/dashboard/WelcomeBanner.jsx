/**
 * WelcomeBanner component for Faculty Connect Dashboard
 *
 * Displays personalized time-based greeting, tagline, and quick actions bar.
 */

import { Link } from 'react-router-dom';
import { MessageSquarePlus, Users, Megaphone, Sparkles } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import ROUTES from '../../constants/routes';

export default function WelcomeBanner() {
  const { user } = useAuth();

  // Time-based greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const facultyName = user?.fullName || 'Faculty Member';
  const department = user?.department || 'IPS Academy';

  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-slate-950/80 border border-purple-500/25 p-6 sm:p-8 shadow-2xl overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Welcome Text */}
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>{department} Portal</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}, <span className="bg-gradient-to-r from-purple-200 via-indigo-100 to-fuchsia-200 bg-clip-text text-transparent">{facultyName}</span>
          </h2>

          {/* Subtitle requirement */}
          <p className="text-sm sm:text-base font-semibold text-purple-200/90">
            Stay connected with your faculty community.
          </p>
        </div>

        {/* Right Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={ROUTES.CHAT}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-purple-950/50 transition-all transform active:scale-95 group"
          >
            <MessageSquarePlus className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform" />
            <span>New Message</span>
          </Link>

          <Link
            to={ROUTES.GROUPS}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-500/30 bg-white/[0.05] hover:bg-white/[0.09] hover:border-purple-400 text-purple-100 font-semibold text-xs sm:text-sm transition-all"
          >
            <Users className="w-4 h-4 text-purple-300" />
            <span>Create Group</span>
          </Link>

          <Link
            to={ROUTES.ANNOUNCEMENTS}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-500/30 bg-white/[0.05] hover:bg-white/[0.09] hover:border-purple-400 text-purple-100 font-semibold text-xs sm:text-sm transition-all"
          >
            <Megaphone className="w-4 h-4 text-purple-300" />
            <span>View Announcements</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
