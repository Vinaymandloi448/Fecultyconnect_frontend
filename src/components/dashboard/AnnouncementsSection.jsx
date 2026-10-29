/**
 * AnnouncementsSection component for Faculty Connect Dashboard
 *
 * Displays official academic circulars, exam notices, and dean updates.
 */

import { Link, useNavigate } from 'react-router-dom';
import { Megaphone, Calendar, ArrowRight, UserCheck, ChevronRight } from 'lucide-react';
import ROUTES from '../../constants/routes';

export default function AnnouncementsSection({ announcements = [] }) {
  const navigate = useNavigate();

  // Demonstration announcements fallback list
  const defaultAnnouncements = [
    {
      id: 'ann-1',
      title: 'Mid-Semester Examination Schedule & Duty Allocations Published',
      category: 'Exam Cell',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      author: 'Dr. S. K. Sharma (Dean Academics)',
      date: 'Today, 09:30 AM',
      summary: 'All faculty members are requested to review their invigilation duty roster and submit mid-term question paper blueprints by Friday.',
    },
    {
      id: 'ann-2',
      title: 'Faculty Development Program (FDP) on AI & Data Science in Higher Education',
      category: 'HOD Circular',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      author: 'Prof. R. K. Gupta (HOD - CSE)',
      date: 'Yesterday, 04:15 PM',
      summary: '5-day AICTE sponsored national workshop registration is open for all engineering and basic sciences faculty members.',
    },
    {
      id: 'ann-3',
      title: 'Annual Research Grant & Paper Publication Incentives Scheme 2026',
      category: 'R&D Cell',
      badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
      author: 'IPS Academy Research Council',
      date: 'Sep 23, 2026',
      summary: 'Proposals for internal seed funding up to ₹2.5 Lakhs are invited from faculty members with active SCOPUS/SCI indexing proposals.',
    },
  ];

  const displayList = announcements.length > 0 ? announcements : defaultAnnouncements;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Official Academic Announcements</h3>
            <p className="text-xs text-purple-300/60">Verified circulars, exam rosters, and dean notices</p>
          </div>
        </div>

        <Link
          to={ROUTES.ANNOUNCEMENTS}
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300 hover:text-white transition-colors group"
        >
          <span>View Noticeboard</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {displayList.map((notice) => (
          <div
            key={notice.id}
            onClick={() => navigate(ROUTES.ANNOUNCEMENTS)}
            className="rounded-2xl bg-white/[0.03] border border-purple-500/20 p-4 sm:p-5 hover:bg-white/[0.06] hover:border-purple-400/40 transition-all duration-200 cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${notice.badgeColor || 'bg-purple-500/20 text-purple-300 border-purple-500/30'}`}>
                  {notice.category}
                </span>
                <span className="text-[11px] text-purple-300/60 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-purple-400" />
                  {notice.date}
                </span>
                <span className="text-[11px] text-purple-300/60 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-purple-400" />
                  {notice.author}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors leading-snug">
                {notice.title}
              </h4>

              <p className="text-xs text-purple-200/70 line-clamp-2">
                {notice.summary}
              </p>
            </div>

            <div className="sm:self-center shrink-0">
              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600/20 group-hover:bg-purple-600 border border-purple-500/30 text-purple-200 group-hover:text-white text-xs font-semibold transition-all">
                <span>Read Notice</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
