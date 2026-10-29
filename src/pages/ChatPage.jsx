/**
 * ChatPage — Slack-Inspired Conversation Interface
 *
 * Supports both channels (/dashboard/channels/:channelId)
 * and direct messages (/dashboard/messages/:userId).
 * Integrates Spring Boot STOMP WebSocket & REST message history.
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Hash,
  MessageSquare,
  Loader2,
  AlertCircle,
  X,
  Users,
  Plus,
} from 'lucide-react';
import ChatHeader from '../components/chat/ChatHeader';
import MessageItem from '../components/chat/MessageItem';
import MessageComposer from '../components/chat/MessageComposer';
import DetailsPanel from '../components/chat/DetailsPanel';
import Avatar from '../components/ui/Avatar';
import NewDmModal from '../components/modals/NewDmModal';
import {
  setActiveConversation,
  fetchMessages,
  fetchConversationById,
  clearChatError,
} from '../features/chat/chatSlice';
import useStomp from '../hooks/useStomp';
import ROUTES from '../constants/routes';

export default function ChatPage() {
  const { channelId, userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const [isDmModalOpen, setIsDmModalOpen] = useState(false);

  const {
    channels,
    facultyMembers,
    conversations,
    messages,
    isLoadingMessages,
    isDetailsPanelOpen,
    error,
  } = useSelector((state) => state.chat);

  const { user: currentUser } = useSelector((state) => state.auth);
  const { isConnected, subscribe } = useStomp();

  // Check if this is the DM root route with no selected conversation
  const isDmRoot = location.pathname === '/dashboard/messages' || (location.pathname.startsWith('/dashboard/messages') && !userId);
  const isDirectMessage = Boolean(userId) || isDmRoot;
  const conversationId = userId || channelId || (isDmRoot ? null : 'general');

  // Find active entity
  const activeChannel = channels.find((c) => c.id === conversationId);
  const activeFaculty = facultyMembers.find((f) => f.id === conversationId || f.facultyId === conversationId);
  const activeConv = conversations.find((c) => c.conversationId === conversationId);

  // Compute other faculty details for backend conversations
  const otherFacultyId =
    activeConv?.participantIds?.find(
      (id) => id !== currentUser?.facultyId && id !== currentUser?.email,
    ) ||
    activeConv?.facultyId ||
    (isDirectMessage ? userId : null);

  const displayFaculty = activeFaculty || {
    id: otherFacultyId || conversationId || 'colleague',
    facultyId: otherFacultyId,
    fullName: otherFacultyId ? `Faculty (${otherFacultyId})` : 'Faculty Colleague',
    designation: 'Faculty Member',
    department: 'Academic Collaboration',
    initials: otherFacultyId ? otherFacultyId.slice(0, 2).toUpperCase() : 'FC',
    avatarColor: 'from-purple-600 to-indigo-600',
    status: isConnected ? 'online' : 'away',
  };

  // Sync with Redux active state & clear stale errors on navigation
  useEffect(() => {
    dispatch(clearChatError());
    if (conversationId) {
      dispatch(
        setActiveConversation({
          id: conversationId,
          type: isDirectMessage ? 'direct' : 'channel',
        }),
      );
    }
  }, [conversationId, isDirectMessage, dispatch]);

  // Load message history from backend only for real CONV- conversations
  useEffect(() => {
    if (conversationId && conversationId.startsWith('CONV-')) {
      dispatch(fetchMessages(conversationId));
      if (!activeConv) {
        dispatch(fetchConversationById(conversationId));
      }
    }
  }, [conversationId, activeConv, dispatch]);

  // Subscribe to STOMP WebSocket topic /topic/conversation/{conversationId}
  useEffect(() => {
    if (isConnected && conversationId && conversationId.startsWith('CONV-')) {
      const unsubscribe = subscribe(conversationId);
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [isConnected, conversationId, subscribe]);

  const conversationMessages = conversationId ? messages[conversationId] || [] : [];

  // Scroll to bottom when new message arrives or history loads
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages.length]);

  const isConversationNotFound =
    !isDmRoot &&
    (error === 'Conversation not found' ||
      (isDirectMessage && conversationId && !conversationId.startsWith('CONV-')));

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-white">
      
      {/* ── MAIN CHAT STREAM ── */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {isDmRoot ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none bg-slate-50/50">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 shadow-2xs">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Direct Academic Messages
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
              Select an existing conversation from the workspace sidebar or start a new direct academic chat with a colleague using their institutional Faculty ID.
            </p>
            <button
              type="button"
              onClick={() => setIsDmModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Start Direct Chat</span>
            </button>
          </div>
        ) : (
          <>
            {/* Chat top header bar */}
            <ChatHeader
              conversation={activeChannel}
              faculty={displayFaculty}
              type={isDirectMessage ? 'direct' : 'channel'}
              isConnected={isConnected}
            />

        {/* Error notification banner if any */}
        {error && !isConversationNotFound && (
          <div className="mx-4 my-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between animate-fadeIn shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => dispatch(clearChatError())}
              className="p-1 hover:text-rose-900 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Message scroll container or Missing Conversation state */}
        {isConversationNotFound ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none bg-slate-50/50">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Conversation Not Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">
              The conversation ID <code className="bg-slate-200/70 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[11px]">{conversationId}</code> does not exist on the server or you are not an authorized participant in it. Please connect with a valid institutional Faculty ID.
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsDmModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Start New Conversation</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.CHAT)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
              >
                Go to General Channel
              </button>
            </div>
          </div>
        ) : (
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
                      This is the start of your direct academic collaboration with {displayFaculty?.fullName}. Share exam duties, curriculum drafts, and real-time updates.
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
                <span>Today, October 29, 2026</span>
              </div>
            </div>

            {/* Messages list with loading & empty states */}
            <div className="flex-1 space-y-0.5 min-h-[120px]">
              {isLoadingMessages ? (
                <div className="py-16 flex flex-col items-center justify-center gap-2.5 text-slate-400 select-none">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-700" />
                  <span className="text-xs font-semibold text-slate-600">
                    Loading message history...
                  </span>
                </div>
              ) : conversationMessages.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs select-none">
                  <MessageSquare className="w-8 h-8 text-slate-300 stroke-1" />
                  <span className="font-bold text-slate-600 text-sm">No messages yet</span>
                  <span className="text-slate-400 max-w-sm text-center">
                    Send a message below to start the conversation over real-time STOMP WebSocket.
                  </span>
                </div>
              ) : (
                conversationMessages.map((msg, index) => {
                  const prev = conversationMessages[index - 1];
                  const isGrouped =
                    prev &&
                    prev.senderId === msg.senderId &&
                    prev.timestamp === msg.timestamp;

                  return (
                    <MessageItem
                      key={msg.messageId || msg.id || index}
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
        )}

        {/* Message Composer at bottom (disabled if conversation not found) */}
        {!isConversationNotFound && (
          <MessageComposer
            conversationId={conversationId}
            placeholder={
              isDirectMessage
                ? `Message ${displayFaculty?.fullName || 'Faculty'}`
                : `Message #${activeChannel?.name || 'channel'}`
            }
          />
        )}
          </>
        )}

      </div>

      {/* ── RIGHT DETAILS PANEL (Slack Style) ── */}
      {isDetailsPanelOpen && !isConversationNotFound && !isDmRoot && (
        <DetailsPanel
          conversation={activeChannel}
          faculty={displayFaculty}
          type={isDirectMessage ? 'direct' : 'channel'}
        />
      )}

      {/* Modal to start a real DM with an institutional faculty ID */}
      <NewDmModal
        isOpen={isDmModalOpen}
        onClose={() => setIsDmModalOpen(false)}
      />

    </div>
  );
}
