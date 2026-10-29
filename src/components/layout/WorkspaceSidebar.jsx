/**
 * WorkspaceSidebar — Slack-inspired secondary sidebar
 *
 * Displays workspace header, channel list, direct message faculty list,
 * unread badges, presence indicators, search filtering, and creation triggers.
 */

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ChevronDown,
  Hash,
  Lock,
  Plus,
  Search,
  CheckCircle2,
  X,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import CreateChannelModal from '../modals/CreateChannelModal';
import NewDmModal from '../modals/NewDmModal';
import { setActiveConversation, fetchConversations } from '../../features/chat/chatSlice';
import { fetchGroups } from '../../features/groups/groupsSlice';
import ROUTES from '../../constants/routes';

export default function WorkspaceSidebar({ mobileOpen, onMobileClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { channels, facultyMembers, conversations } = useSelector((state) => state.chat);
  const { groups } = useSelector((state) => state.groups);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [filterQuery, setFilterQuery] = useState('');
  const [channelsCollapsed, setChannelsCollapsed] = useState(false);
  const [dmsCollapsed, setDmsCollapsed] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isDmModalOpen, setIsDmModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Automatically fetch groups and conversations from backend on mount
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchGroups());
      dispatch(fetchConversations());
    }
  }, [currentUser, dispatch]);

  // Combine static channels with backend groups
  const groupChannels = (groups || []).map((g) => ({
    id: g.groupId || g.id,
    name: g.name,
    isPrivate: false,
    unreadCount: 0,
    isGroup: true,
  }));

  const allChannels = [
    ...channels,
    ...groupChannels.filter((gc) => !channels.some((c) => c.id === gc.id)),
  ];

  // Filter channels by search
  const filteredChannels = allChannels.filter((c) =>
    c.name.toLowerCase().includes(filterQuery.toLowerCase()),
  );

  // Render real backend 1-on-1 conversations from GET /api/conversations
  const backendDMs = (conversations || []).map((conv) => {
    const otherParticipant =
      conv.participantIds?.find(
        (id) => id !== currentUser?.facultyId && id !== currentUser?.email,
      ) || conv.participantIds?.[0] || 'Faculty Colleague';

    return {
      id: conv.conversationId,
      conversationId: conv.conversationId,
      fullName: otherParticipant,
      initials: otherParticipant.slice(0, 2).toUpperCase(),
      status: 'online',
      avatarColor: 'from-purple-600 to-indigo-600',
      isConversation: true,
    };
  });

  const filteredDMs = backendDMs.filter((dm) =>
    dm.fullName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    dm.id.toLowerCase().includes(filterQuery.toLowerCase()),
  );


  const handleSelectChannel = (channelId) => {
    dispatch(setActiveConversation({ id: channelId, type: 'channel' }));
    if (onMobileClose) onMobileClose();
    navigate(ROUTES.channelUrl(channelId));
  };

  const handleSelectFaculty = (facultyId) => {
    dispatch(setActiveConversation({ id: facultyId, type: 'direct' }));
    if (onMobileClose) onMobileClose();
    navigate(ROUTES.messageUrl(facultyId));
  };

  const isChannelActive = (channelId) =>
    location.pathname === ROUTES.channelUrl(channelId);

  const isDmActive = (facultyId) =>
    location.pathname === ROUTES.messageUrl(facultyId);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#3F0E40] text-[#D1C2D9] select-none text-sm border-r border-purple-950/40">
      
      {/* ── WORKSPACE HEADER ── */}
      <div className="relative px-4 h-14 border-b border-[#522653] flex items-center justify-between shrink-0">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 hover:bg-white/10 p-1.5 -ml-1 rounded-lg transition-colors focus:outline-none text-left min-w-0"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-[15px] truncate">
                FacultyConnect
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300 shrink-0" />
            </div>
            <p className="text-[11px] text-[#D1C2D9]/70 truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Campus Workspace</span>
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-purple-200 shrink-0 ml-1" />
        </button>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={onMobileClose}
            className="md:hidden p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Dropdown Menu */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute top-14 left-3 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-slideDown">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <div className="font-bold text-xs text-slate-900 truncate">FacultyConnect Workspace</div>
                <div className="text-[11px] text-slate-500 truncate">
                  Signed in as {currentUser?.fullName || 'Faculty Member'}
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(ROUTES.DASHBOARD);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-purple-50 text-slate-700 flex items-center justify-between"
                >
                  <span>Workspace Home</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setIsChannelModalOpen(true);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-purple-50 text-slate-700 flex items-center justify-between"
                >
                  <span>Create a Channel</span>
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setIsDmModalOpen(true);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-purple-50 text-slate-700 flex items-center justify-between"
                >
                  <span>Start Direct Message</span>
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(ROUTES.PROFILE);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-purple-50 text-slate-700 flex items-center justify-between"
                >
                  <span>Faculty Profile & Status</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── SEARCH / FILTER INPUT ── */}
      <div className="p-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-purple-300/60">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Jump to or search..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#350d36]/70 border border-purple-400/20 text-white placeholder-purple-300/40 text-xs focus:bg-[#350d36] focus:border-purple-300 focus:outline-none transition-all"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-purple-300/60 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── SCROLLABLE LIST AREA ── */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 py-1 dark-scrollbar">
        
        {/* ── CHANNELS SECTION ── */}
        <div>
          <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-purple-200/70 group">
            <button
              onClick={() => setChannelsCollapsed(!channelsCollapsed)}
              className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none"
            >
              {channelsCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              <span className="uppercase tracking-wider text-[11px] font-bold">
                Channels
              </span>
            </button>
            <button
              onClick={() => setIsChannelModalOpen(true)}
              className="p-1 rounded-md text-purple-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              title="Create a Channel"
              aria-label="Create a Channel"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {!channelsCollapsed && (
            <div className="space-y-0.5 mt-1">
              {filteredChannels.length === 0 ? (
                <p className="px-3 py-2 text-xs text-purple-300/50 italic">
                  No channels match filter
                </p>
              ) : (
                filteredChannels.map((channel) => {
                  const active = isChannelActive(channel.id);
                  return (
                    <button
                      key={channel.id}
                      onClick={() => handleSelectChannel(channel.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between group transition-colors focus:outline-none ${
                        active
                          ? 'bg-[#1164A3] text-white font-semibold shadow-xs'
                          : 'text-[#D1C2D9] hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {channel.isPrivate ? (
                          <Lock className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        ) : (
                          <Hash className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        )}
                        <span className="truncate text-xs tracking-tight">
                          {channel.name}
                        </span>
                      </div>
                      {channel.unreadCount > 0 && !active && (
                        <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold leading-none">
                          {channel.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}

              {/* Add channels button */}
              <button
                onClick={() => setIsChannelModalOpen(true)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-purple-300/70 hover:text-white hover:bg-white/5 flex items-center gap-2 text-xs transition-colors mt-0.5"
              >
                <div className="w-4 h-4 rounded-md bg-white/10 flex items-center justify-center">
                  <Plus className="w-3 h-3 text-white" />
                </div>
                <span>Add channels</span>
              </button>
            </div>
          )}
        </div>

        {/* ── DIRECT MESSAGES SECTION ── */}
        <div>
          <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-purple-200/70 group">
            <button
              onClick={() => setDmsCollapsed(!dmsCollapsed)}
              className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none"
            >
              {dmsCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              <span className="uppercase tracking-wider text-[11px] font-bold">
                Direct Messages
              </span>
            </button>
            <button
              onClick={() => setIsDmModalOpen(true)}
              className="p-1 rounded-md text-purple-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              title="Start a Direct Message"
              aria-label="Start a Direct Message"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {!dmsCollapsed && (
            <div className="space-y-0.5 mt-1">
              {filteredDMs.length === 0 ? (
                <div className="px-3 py-2 text-xs text-purple-300/60 flex flex-col gap-1.5">
                  <span className="italic">
                    {filterQuery ? 'No conversations match search' : 'No active conversations yet'}
                  </span>
                  <button
                    onClick={() => setIsDmModalOpen(true)}
                    className="text-left text-[11px] text-purple-200 hover:text-white font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    + Start Conversation
                  </button>
                </div>
              ) : (
                filteredDMs.map((dm) => {
                  const active = isDmActive(dm.id);
                  return (
                    <button
                      key={dm.id}
                      onClick={() => handleSelectFaculty(dm.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between group transition-colors focus:outline-none cursor-pointer ${
                        active
                          ? 'bg-[#1164A3] text-white font-semibold shadow-xs'
                          : 'text-[#D1C2D9] hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar
                          name={dm.fullName}
                          initials={dm.initials}
                          status={dm.status}
                          size="xs"
                          rounded="lg"
                          gradient={dm.avatarColor}
                        />
                        <span className="truncate text-xs font-medium">
                          {dm.fullName}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}

              {/* Start new DM button */}
              <button
                onClick={() => setIsDmModalOpen(true)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-purple-300/70 hover:text-white hover:bg-white/5 flex items-center gap-2 text-xs transition-colors mt-0.5 cursor-pointer"
              >
                <div className="w-4 h-4 rounded-md bg-white/10 flex items-center justify-center">
                  <Plus className="w-3 h-3 text-white" />
                </div>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ── MODALS ── */}
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

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 h-full flex-col z-20">
        {sidebarContent}
      </aside>

      {/* Mobile drawer with backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-fadeIn">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
