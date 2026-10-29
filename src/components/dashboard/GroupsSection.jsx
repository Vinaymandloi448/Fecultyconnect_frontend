/**
 * GroupsSection component for Faculty Connect Dashboard
 *
 * Displays academic and departmental groups with member counts
 * and instant navigation to the Groups page (/groups).
 */

import { Link, useNavigate } from 'react-router-dom';
import { Users, Building2, BookOpen, Award, ArrowRight, ExternalLink } from 'lucide-react';
import ROUTES from '../../constants/routes';

export default function GroupsSection({ groups = [] }) {
  const navigate = useNavigate();

  // Demonstration academic groups list fallback
  const defaultGroups = [
    {
      id: 'grp-1',
      name: 'Computer Science Faculty Hub',
      department: 'Computer Science & Eng.',
      memberCount: 32,
      category: 'Department Channel',
      icon: Building2,
      accentColor: 'from-purple-600 to-indigo-600',
    },
    {
      id: 'grp-2',
      name: 'NAAC & NBA Accreditation Committee',
      department: 'Institutional Cell',
      memberCount: 18,
      category: 'Committee',
      icon: Award,
      accentColor: 'from-indigo-600 to-fuchsia-600',
    },
    {
      id: 'grp-3',
      name: 'AI & Machine Learning Research Group',
      department: 'Inter-Departmental',
      memberCount: 24,
      category: 'Research',
      icon: BookOpen,
      accentColor: 'from-fuchsia-600 to-purple-600',
    },
  ];

  const displayGroups = groups.length > 0 ? groups : defaultGroups;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-300">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Joined Academic Groups</h3>
            <p className="text-xs text-purple-300/60">Department channels, committees, and research groups</p>
          </div>
        </div>

        <Link
          to={ROUTES.GROUPS}
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300 hover:text-white transition-colors group"
        >
          <span>Explore All Groups</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayGroups.map((group) => {
          const GroupIcon = group.icon || Building2;

          return (
            <div
              key={group.id}
              className="rounded-2xl bg-white/[0.03] border border-purple-500/20 p-5 hover:bg-white/[0.06] hover:border-purple-400/40 transition-all duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${group.accentColor || 'from-purple-600 to-indigo-600'} flex items-center justify-center text-white shadow-md shrink-0`}>
                    <GroupIcon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/20">
                    {group.category || 'Group'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-1">
                    {group.name}
                  </h4>
                  <p className="text-xs text-purple-300/70 truncate mt-0.5">
                    {group.department}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-purple-300/70 font-medium">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>{group.memberCount} Members</span>
                </div>

                <button
                  onClick={() => navigate(ROUTES.GROUPS)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-500/30 text-purple-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  <span>Open Group</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
