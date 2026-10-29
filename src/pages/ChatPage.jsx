/**
 * ChatPage — Slack-Inspired Conversation Interface
 *
 * Supports both channels (/dashboard/channels/:channelId)
 * and direct messages (/dashboard/messages/:userId).
 */

import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Hash, MessageSquare, Sparkles, Loader2, Wifi, WifiOff } from 'lucide-react';
import ChatHeader from '../components/chat/ChatHeader';
import MessageItem from '../components/chat/MessageItem';
import MessageComposer from '../components/chat/MessageComposer';
import DetailsPanel from '../components/chat/DetailsPanel';
import Avatar from '../components/ui/Avatar';
import { setActiveConversation, fetchMessages } from '../features/chat/chatSlice';
import useStomp from '../hooks/useStomp';

export default function ChatPage() {
  const { channelId, userId } = useParams();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const {
    channels,
    facultyMembers,
    conversations,
    messages,
    isLoadingMessages,
    isDetailsPanelOpen,
  } = useSelector((state) => state.chat);

  const { user: currentUser } = useSelector((state) => state.auth);
  const { isConnected, subscribe } = useStomp();

  // Determine conversation ID and type from URL parameters
  const isDirectMessage = Boolean(userId);
  const conversationId = isDirectMessage ? userId : channelId || 'general';

  // Find active entity
  const activeChannel = channels.find((c) => c.id === conversationId);
  const activeFaculty = facultyMembers.find((f) => f.id === conversationId);
  const activeConv = conversations.find((c) => c.conversationId === conversationId);

  // Compute other faculty details for backend conversations
  const otherFacultyId =
    activeConv?.participantIds?.find((id) => id !== currentUser?.facultyId) ||
    activeConv?.facultyId ||
    (isDirectMessage ? userId : null);

  const displayFaculty = activeFaculty || {
    id: otherFacultyId || conversationId,
    facultyId: otherFacultyId,
    fullName: otherFacultyId ? `Faculty (${otherFacultyId})` : 'Faculty Colleague',
    designation: 'Faculty Member',
    department: 'Academic Collaboration',
    initials: otherFacultyId ? otherFacultyId.slice(0, 2).toUpperCase() : 'FC',
    avatarColor: 'from-purple-600 to-indigo-600',
    status: isConnected ? 'online' : 'away',
  };

  // Sync with Redux active state
  useEffect(() => {
    dispatch(
      setActiveConversation({
        id: conversationId,
        type: isDirectMessage ? 'direct' : 'channel',
      }),
    );
  }, [conversationId, isDirectMessage, dispatch]);

  // Load message history from backend for conversation
  useEffect(() => {
    // If conversation starts with CONV- or is a direct message, fetch from Spring Boot
    if (conversationId && (isDirectMessage || conversationId.startsWith('CONV-'))) {
      dispatch(fetchMessages(conversationId));
    }
  }, [conversationId, isDirectMessage, dispatch]);

  // Subscribe to STOMP WebSocket topic /topic/conversation/{conversationId}
  useEffect(() => {
    if (isConnected && conversationId && (isDirectMessage || conversationId.startsWith('CONV-'))) {
      const unsubscribe = subscribe(conversationId);
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [isConnected, conversationId, isDirectMessage, subscribe]);

  const conversationMessages = messages[conversationId] || [];

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages.length]);

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-white">
      
      {/* ── MAIN CHAT STREAM ── */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* Chat top header bar */}
        <ChatHeader
          conversation={activeChannel}
          faculty={displayFaculty}
          type={isDirectMessage ? 'direct' : 'channel'}
        />

        {/* Message scroll container */}
        <div className="flex-1 overflow-y-auto px-2 py-4 flex flex-col">
          
          {/* Welcome / Header Banner at start of message log */}
          <div className="px-4 sm:px-6 pt-4 pb-6 mb-2 border-b border-slate-100 select-none">
            {isDirectMessage ? (
              <div className="flex items-start gap-3">
                <Avatar
                  name={displayFaculty?.fullName || 'Faculty Member'}
                  initials={displayFaculty?.initials}
                  size="xl"
                  rounded="2xl"
                  gradient={displayFaculty?.avatarColor}
                />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    {displayFaculty?.fullName || 'Faculty Colleague'}
                  </h3>
                  <p className="text-xs text-purple-700 font-semibold">
                    {displayFaculty?.designation} · {displayFaculty?.department}
                  </p>
                  <p className="text-xs text-slate-500">
                    This is the start of your direct academic collaboration with {displayFaculty?.fullName}. Share exam duties, curriculum drafts, and private updates.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Hash className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Welcome to #{activeChannel?.name || 'general'}!
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {activeChannel?.description ||
                    'This is the beginning of the channel. Join the faculty discussions and resource sharing.'}
                </p>
              </div>
            )}
          </div>

          {/* Date Separator Pill */}
          <div className="relative my-4 text-center select-none">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-slate-500 shadow-xs">
              <span>Today, October 27, 2026</span>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 space-y-0.5">
            {conversationMessages.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No messages yet. Send a message below to start the conversation!
              </div>
            ) : (
              conversationMessages.map((msg, index) => {
                // Determine if consecutive message from same sender
                const prev = conversationMessages[index - 1];
                const isGrouped =
                  prev &&
                  prev.senderId === msg.senderId &&
                  prev.timestamp === msg.timestamp;

                return (
                  <MessageItem
                    key={msg.id || index}
                    message={msg}
                    conversationId={conversationId}
                    isGrouped={isGrouped}
                  />
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

        </div>

        {/* Message Composer at bottom */}
        <MessageComposer
          conversationId={conversationId}
          placeholder={
            isDirectMessage
              ? `Message ${displayFaculty?.fullName || 'Faculty'}`
              : `Message #${activeChannel?.name || 'channel'}`
          }
        />

      </div>

      {/* ── RIGHT DETAILS PANEL (Slack Style) ── */}
      {isDetailsPanelOpen && (
        <DetailsPanel
          conversation={activeChannel}
          faculty={displayFaculty}
          type={isDirectMessage ? 'direct' : 'channel'}
        />
      )}

    </div>
  );
}
