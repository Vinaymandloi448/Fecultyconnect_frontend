/**
 * MessageItem — Slack-inspired message row with reactions and file previews
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FileText,
  Download,
  Smile,
  Copy,
  Check,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import { toggleReaction } from '../../features/chat/chatSlice';

export default function MessageItem({
  message,
  conversationId,
  isGrouped = false,
}) {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [copied, setCopied] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const popularEmojis = ['👍', '❤️', '💡', '📝', '🚀', '🎉', '🙏', '☕'];

  const handleToggleReaction = (emoji) => {
    dispatch(
      toggleReaction({
        conversationId,
        messageId: message.id,
        emoji,
        userId: currentUser?.id || 'fac-01',
      }),
    );
    setShowEmojiPicker(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFileIcon = (type) => {
    switch (type) {
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'pdf':
      default:
        return <FileText className="w-5 h-5 text-rose-600" />;
    }
  };

  return (
    <div
      className={`group relative flex gap-3 px-4 sm:px-6 py-2 hover:bg-slate-50 transition-colors ${
        isGrouped ? 'pt-0.5' : 'mt-1'
      }`}
    >
      {/* ── SENDER AVATAR ── */}
      {!isGrouped ? (
        <Avatar
          name={message.senderName}
          initials={message.senderInitials}
          size="md"
          rounded="xl"
          gradient={message.senderAvatarColor}
        />
      ) : (
        <div className="w-9 shrink-0 text-center">
          <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity select-none">
            {message.timestamp?.split('at ')[1] || ''}
          </span>
        </div>
      )}

      {/* ── MESSAGE BODY ── */}
      <div className="flex-1 min-w-0">
        
        {/* Header (Sender Name, Designation, Time, Status) */}
        {!isGrouped && (
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-sm font-bold text-slate-900">
              {message.senderName || message.senderId}
            </span>
            {message.senderDesignation && (
              <span className="px-1.5 py-0.2 rounded-md bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-200">
                {message.senderDesignation}
              </span>
            )}
            <span className="text-[11px] text-slate-400 font-normal">
              {message.timestamp}
            </span>
            {message.status && (
              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono font-medium">
                {message.status}
              </span>
            )}
          </div>
        )}


        {/* Text Content */}
        <div className="text-sm text-slate-800 leading-relaxed break-words whitespace-pre-wrap font-normal">
          {message.content}
        </div>

        {/* ── ATTACHED FILE CARD (if any) ── */}
        {message.attachment && (
          <div className="mt-2.5 max-w-sm rounded-xl border border-slate-200 bg-white p-3 shadow-xs hover:border-purple-300 transition-colors flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                {renderFileIcon(message.attachment.type)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate" title={message.attachment.name}>
                  {message.attachment.name}
                </div>
                <div className="text-[11px] text-slate-400">
                  {message.attachment.size} · Academic Document
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Simulated download for: ${message.attachment.name}`)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors shrink-0"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── REACTIONS ROW ── */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {message.reactions.map((reaction) => {
              const hasReacted = reaction.users?.includes(currentUser?.id || 'fac-01');
              return (
                <button
                  key={reaction.emoji}
                  onClick={() => handleToggleReaction(reaction.emoji)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    hasReacted
                      ? 'bg-purple-100 border-purple-300 text-purple-900 shadow-xs'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/70'
                  }`}
                  title={`${reaction.count} faculty reacted with ${reaction.emoji}`}
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-[11px]">{reaction.count}</span>
                </button>
              );
            })}

            {/* Quick add reaction button */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="px-1.5 py-0.5 rounded-full border border-dashed border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-800 text-xs transition-colors"
              title="Add reaction"
            >
              +
            </button>
          </div>
        )}

      </div>

      {/* ── HOVER TOOLBAR ON MESSAGE ── */}
      <div className="absolute top-1 right-4 hidden group-hover:flex items-center bg-white border border-slate-200 rounded-lg shadow-sm px-1 py-0.5 z-10">
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1.5 rounded-md text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
            title="React"
          >
            <Smile className="w-3.5 h-3.5" />
          </button>

          {/* Emoji Picker Popover */}
          {showEmojiPicker && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowEmojiPicker(false)}
              />
              <div className="absolute right-0 bottom-8 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 flex items-center gap-1 animate-slideDown">
                {popularEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleToggleReaction(emoji)}
                    className="p-1.5 rounded-lg hover:bg-purple-100 text-base transition-transform hover:scale-125 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
          title="Copy message text"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

    </div>
  );
}
