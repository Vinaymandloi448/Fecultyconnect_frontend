/**
 * DashboardPage — Main FacultyConnect Workspace Home (/dashboard)
 *
 * Slack-inspired home hub providing:
 * - Welcome greeting & faculty status
 * - Quick jump to recent conversations
 * - Pinned urgent announcements
 * - Recently shared academic documents
 * - Frequently used department channels
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Hash,
  MessageSquare,
  Megaphone,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Download,
  AlertCircle,
  Plus,
  BookOpen,
  Calendar,
  Users,
  Loader2,
  Building2,
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import CreateChannelModal from '../components/modals/CreateChannelModal';
import NewDmModal from '../components/modals/NewDmModal';
import { updateUserStatus } from '../features/auth/authSlice';
import { fetchProfile } from '../features/profile/profileSlice';
import { fetchGroups } from '../features/groups/groupsSlice';
import { fetchConversations } from '../features/chat/chatSlice';
import ROUTES from '../constants/routes';

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isMockAuth } = useSelector((state) => state.auth);
  const { profileData } = useSelector((state) => state.profile);
  const activeFaculty = profileData || user;

  const { channels, facultyMembers, messages, conversations, isLoading: isLoadingChat } =
    useSelector((state) => state.chat);
  const { groups, isLoading: isLoadingGroups } = useSelector((state) => state.groups);
  const { announcements } = useSelector((state) => state.announcements);
  const { documents } = useSelector((state) => state.documents);

  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isDmModalOpen, setIsDmModalOpen] = useState(false);

  // Fetch real backend profile, groups and conversations on mount
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchGroups());
    dispatch(fetchConversations());
  }, [dispatch]);

  // Status switcher helpers
  const handleSetStatus = (newStatus) => {
    dispatch(updateUserStatus({ status: newStatus }));
  };

  // Build real conversation list from backend conversations or fall back to active channels
  const backendConvos = (conversations || []).map((conv) => {
    const otherFacultyId =
      conv.participantIds?.find(
        (id) => id !== user?.facultyId && id !== user?.email,
      ) || conv.participantIds?.[0] || 'Faculty Colleague';

    const lastMsg =
      messages[conv.conversationId]?.[messages[conv.conversationId].length - 1]?.content ||
      'Start peer collaboration';

    const timestamp = conv.updatedAt
      ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Active';

    return {
      id: conv.conversationId,
      name: otherFacultyId,
      type: 'direct',
      facultyId: otherFacultyId,
      lastMessage: lastMsg,
      timestamp: 'Today at ' + timestamp,
      unread: 0,
      path: ROUTES.messageUrl(conv.conversationId),
    };
  });

  const defaultChannels = [
    {
      id: 'general',
      name: 'general',
      type: 'channel',
      lastMessage: messages['general']?.[messages['general'].length - 1]?.content || 'Active faculty discussions',
      timestamp: 'Today at 10:14 AM',
      unread: 0,
      path: ROUTES.channelUrl('general'),
    },
    {
      id: 'computer-science',
      name: 'computer-science',
      type: 'channel',
      lastMessage: messages['computer-science']?.[messages['computer-science'].length - 1]?.content || 'Lab roster updates',
      timestamp: 'Today at 11:35 AM',
      unread: 0,
      path: ROUTES.channelUrl('computer-science'),
    },
  ];

  const recentConvos = backendConvos.length > 0
    ? [...backendConvos.slice(0, 4), ...defaultChannels.slice(0, 2)]
    : defaultChannels;

  // Pinned urgent announcements
  const topAnnouncements = announcements.slice(0, 3);

  // Recent documents
  const recentDocs = documents.slice(0, 4);


  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full select-none">
      
      {/* ── TOP BANNER: Welcome Faculty Member ── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#350d36] via-[#3F0E40] to-[#522653] text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Faculty Portal</span>
              {isMockAuth && (
                <>
                  <span>•</span>
                  <span className="text-amber-300">Mock Dev Mode</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {activeFaculty?.fullName || 'Faculty Colleague'}!
            </h1>

            <p className="text-xs sm:text-sm text-purple-200/90 max-w-2xl leading-relaxed">
              {activeFaculty?.designation || 'Professor'} · {activeFaculty?.department || 'Computer Science & Engineering'}
              {activeFaculty?.facultyId && (
                <span> · ID: <strong className="text-white font-mono">{activeFaculty.facultyId}</strong></span>
              )}.
              Collaborate with colleagues, join department groups, and access official college notices.
            </p>
          </div>

          {/* Quick Availability Pills */}
          <div className="shrink-0 space-y-2">
            <span className="text-[11px] font-bold text-purple-200/70 uppercase tracking-wider block">
              Current Availability
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleSetStatus('online')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                  user?.status === 'online'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-xs'
                    : 'bg-white/10 text-white/80 border-transparent hover:bg-white/15'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Active</span>
              </button>

              <button
                onClick={() => handleSetStatus('in_lecture')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                  user?.status === 'in_lecture'
                    ? 'bg-purple-400/30 text-purple-200 border-purple-300/40 shadow-xs'
                    : 'bg-white/10 text-white/80 border-transparent hover:bg-white/15'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>In Class</span>
              </button>

              <button
                onClick={() => handleSetStatus('away')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                  user?.status === 'away'
                    ? 'bg-amber-400/30 text-amber-200 border-amber-300/40 shadow-xs'
                    : 'bg-white/10 text-white/80 border-transparent hover:bg-white/15'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Office Hours</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── QUICK ACTION SHORTCUTS BAR ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => setIsChannelModalOpen(true)}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all text-left group flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Create Channel</div>
              <div className="text-[10px] text-slate-400">Subject or committee</div>
            </div>
          </div>
          <Plus className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
        </button>

        <button
          onClick={() => setIsDmModalOpen(true)}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all text-left group flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">New Message</div>
              <div className="text-[10px] text-slate-400">1-on-1 peer chat</div>
            </div>
          </div>
          <Plus className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
        </button>

        <button
          onClick={() => navigate(ROUTES.ANNOUNCEMENTS)}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all text-left group flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Announcements</div>
              <div className="text-[10px] text-slate-400">Dean & HOD notices</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
        </button>

        <button
          onClick={() => navigate(ROUTES.FILES)}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all text-left group flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Academic Files</div>
              <div className="text-[10px] text-slate-400">Syllabi & rosters</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
        </button>
      </div>

      {/* ── TWO-COLUMN SPLIT: Recent Conversations & Important Announcements ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Quick Access to Recent Conversations (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-700" />
              <span>Recent Conversations</span>
            </h2>
            <Link
              to={ROUTES.channelUrl('general')}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 transition-colors"
            >
              Open all channels
            </Link>
          </div>

          <div className="space-y-2">
            {recentConvos.map((conv) => (
              <Link
                key={conv.id}
                to={conv.path}
                className="block p-4 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {conv.type === 'channel' ? (
                      <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                        <Hash className="w-4 h-4" />
                      </div>
                    ) : (
                      <Avatar
                        name={conv.name}
                        initials={conv.faculty?.initials}
                        status={conv.faculty?.status}
                        size="md"
                        rounded="xl"
                        gradient={conv.faculty?.avatarColor}
                      />
                    )}

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 group-hover:text-purple-700 transition-colors">
                          {conv.type === 'channel' ? `#${conv.name}` : conv.name}
                        </span>
                        {conv.unread > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                            {conv.unread} new
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-md">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0">
                    {conv.timestamp}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Urgent Official Announcements (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-rose-600" />
              <span>Official Notices</span>
            </h2>
            <Link
              to={ROUTES.ANNOUNCEMENTS}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {topAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs space-y-2 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      ann.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-700'
                        : ann.priority === 'high'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ann.priority}
                  </span>
                  <span className="text-[11px] text-slate-400">{ann.date}</span>
                </div>

                <h3 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                  {ann.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>

                <div className="pt-1 flex items-center justify-between text-[11px] border-t border-slate-100">
                  <span className="text-slate-500 truncate max-w-[180px]">
                    {ann.author}
                  </span>
                  <Link
                    to={ROUTES.ANNOUNCEMENTS}
                    className="text-purple-700 hover:text-purple-900 font-semibold"
                  >
                    Read Circular →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── ACADEMIC GROUPS SECTION (Spring Boot Backend) ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Departmental & Academic Groups
              </h2>
              <p className="text-[11px] text-slate-500">
                Loaded directly from backend <code className="text-purple-700 bg-purple-50 px-1 rounded">GET /api/groups</code>
              </p>
            </div>
          </div>
          <Link
            to={ROUTES.GROUPS}
            className="text-xs font-semibold text-purple-700 hover:text-purple-900 transition-colors flex items-center gap-1"
          >
            <span>Manage all groups ({groups.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoadingGroups ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            <span>Loading academic groups from database...</span>
          </div>
        ) : groups.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No faculty groups yet</p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Create your department committee or syllabus coordination group to start collaborating.
            </p>
            <button
              onClick={() => setIsChannelModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Group</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {groups.slice(0, 3).map((group) => (
              <div
                key={group.groupId || group.id}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 truncate max-w-[160px]">
                      {group.department}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 font-mono">
                      {group.groupId}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-1" title={group.name}>
                    {group.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {group.description || `Active faculty group for ${group.department}.`}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">
                    {group.memberIds?.length || 0} members
                  </span>
                  <Link
                    to={ROUTES.GROUPS}
                    className="text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── RECENTLY SHARED ACADEMIC DOCUMENTS ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-700" />
            <span>Recently Shared Academic Documents</span>
          </h2>

          <Link
            to={ROUTES.FILES}
            className="text-xs font-semibold text-purple-700 hover:text-purple-900 transition-colors"
          >
            Open File Repository
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {recentDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 line-clamp-2" title={doc.name}>
                  {doc.name}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  Shared by {doc.sharedBy}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{doc.size}</span>
                <button
                  onClick={() => alert(`Simulated download for: ${doc.name}`)}
                  className="p-1 rounded-md text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                  title="Download file"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <CreateChannelModal
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
      />
      <NewDmModal
        isOpen={isDmModalOpen}
        onClose={() => setIsDmModalOpen(false)}
      />

    </div>
  );
}
