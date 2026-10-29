/**
 * ChatHeader — Slack-style conversation top bar
 *
 * Displays channel/DM identity, topic, members, star, STOMP connection state, and details panel toggle.
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Hash,
  Lock,
  Star,
  Users,
  Info,
  Radio,
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import { toggleDetailsPanel } from '../../features/chat/chatSlice';

export default function ChatHeader({
  conversation,
  type = 'channel',
  faculty,
  isConnected = false,
}) {
  const dispatch = useDispatch();
  const { isDetailsPanelOpen } = useSelector((state) => state.chat);
  const [isStarred, setIsStarred] = useState(false);

  return (
    <div className="h-14 px-4 sm:px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 select-none">
      
      {/* ── LEFT: Title & Topic / Designation ── */}
      <div className="flex items-center gap-3 min-w-0">
        {type === 'channel' ? (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              {conversation?.isPrivate ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Hash className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight truncate">
                  {conversation?.name || 'general'}
                </h2>
                <button
                  onClick={() => setIsStarred(!isStarred)}
                  className={`p-0.5 rounded-md hover:bg-slate-100 transition-colors ${
                    isStarred ? 'text-amber-400' : 'text-slate-300 hover:text-slate-500'
                  }`}
                  title={isStarred ? 'Unstar channel' : 'Star channel'}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-md hidden sm:block">
                {conversation?.topic || conversation?.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 min-w-0">
            <Avatar
              name={faculty?.fullName || 'Faculty Member'}
              initials={faculty?.initials}
              status={faculty?.status}
              size="md"
              rounded="xl"
              gradient={faculty?.avatarColor}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight truncate">
                  {faculty?.fullName || 'Faculty Member'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {faculty?.status === 'away'
                    ? 'Away'
                    : faculty?.status === 'in_lecture'
                    ? 'In Class'
                    : 'Online'}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">
                {faculty?.designation} · {faculty?.department}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT: Connection status badge, Members & Details Toggle ── */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* Real-time STOMP status badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
            isConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
          title={
            isConnected
              ? 'Connected to Spring Boot STOMP broker (/ws)'
              : 'Connecting to STOMP / REST Fallback'
          }
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="hidden xs:inline">{isConnected ? 'STOMP Live' : 'Connecting'}</span>
        </div>

        {type === 'channel' && (
          <button
            onClick={() => dispatch(toggleDetailsPanel())}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            title="View channel members"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>{conversation?.memberCount || 1}</span>
          </button>
        )}

        {/* Toggle Details Panel Button */}
        <button
          onClick={() => dispatch(toggleDetailsPanel())}
          className={`p-2 rounded-lg border transition-colors ${
            isDetailsPanelOpen
              ? 'bg-purple-50 border-purple-200 text-purple-700'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          title={isDetailsPanelOpen ? 'Hide details' : 'Show details'}
          aria-label="Toggle details panel"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
