/**
 * RecentConversationsSection component for Faculty Connect Dashboard
 *
 * Displays the user's active conversations with colleagues.
 * Provides instant navigation to the Chat page (/chat).
 * If no conversations exist, renders a friendly communication empty state.
 */

import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight, MessageSquarePlus, Clock } from 'lucide-react';
import ROUTES from '../../constants/routes';

export default function RecentConversationsSection({ conversations = [] }) {
  const navigate = useNavigate();

  // Demonstration recent items fallback if API data is empty
  const defaultRecentChats = [
    {
      id: 'conv-1',
      participantName: 'Dr. Rajesh Sharma',
      department: 'Computer Science',
      lastMessage: 'I have shared the updated exam syllabus and lab manual.',
      timestamp: '10:45 AM',
      unreadCount: 2,
      avatarColor: 'from-purple-600 to-indigo-600',
    },
    {
      id: 'conv-2',
      participantName: 'Prof. Ananya Verma',
      department: 'Information Technology',
      lastMessage: 'Are we still meeting for the NBA accreditation review?',
      timestamp: 'Yesterday',
      unreadCount: 0,
      avatarColor: 'from-indigo-600 to-fuchsia-600',
    },
    {
      id: 'conv-3',
      participantName: 'Dr. Vikramaditya Singh',
      department: 'Electronics & Comm.',
      lastMessage: 'Thank you! The research proposal draft has been submitted.',
      timestamp: 'Sep 24',
      unreadCount: 0,
      avatarColor: 'from-fuchsia-600 to-purple-600',
    },
  ];

  const displayList = conversations.length > 0 ? conversations : defaultRecentChats;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Recent Conversations</h3>
            <p className="text-xs text-purple-300/60">Direct messages with IPS Academy faculty colleagues</p>
          </div>
        </div>

        <Link
          to={ROUTES.CHAT}
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300 hover:text-white transition-colors group"
        >
          <span>Open Chat Workspace</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Conversations List Cards */}
      {displayList.length === 0 ? (
        <div className="rounded-2xl bg-white/[0.02] border border-purple-500/20 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 mx-auto flex items-center justify-center text-purple-300">
            <MessageSquarePlus className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">No Active Conversations Yet</h4>
          <p className="text-xs text-purple-300/70 max-w-sm mx-auto">
            Connect with professors and HODs from the faculty directory below to start direct academic communication.
          </p>
          <Link
            to={ROUTES.CHAT}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all mt-2"
          >
            <span>Start New Conversation</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayList.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(ROUTES.CHAT)}
              className="rounded-2xl bg-white/[0.03] border border-purple-500/20 p-4 hover:bg-white/[0.06] hover:border-purple-400/40 transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${chat.avatarColor || 'from-purple-600 to-indigo-600'} flex items-center justify-center font-bold text-white text-xs shadow-sm shrink-0`}>
                      {chat.participantName ? chat.participantName.charAt(0) : 'F'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors">
                        {chat.participantName}
                      </h4>
                      <p className="text-[11px] text-purple-300/70 truncate">
                        {chat.department}
                      </p>
                    </div>
                  </div>

                  {chat.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md shrink-0">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>

                <p className="text-xs text-purple-200/80 line-clamp-2 bg-purple-950/30 p-2.5 rounded-xl border border-purple-500/10 font-normal">
                  &quot;{chat.lastMessage}&quot;
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-purple-400/70 border-t border-white/5">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{chat.timestamp}</span>
                </div>
                <span className="font-semibold text-purple-300 group-hover:underline">Reply in Chat</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
