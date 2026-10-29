/**
 * MessageItem — Slack-inspired message row with reactions and file previews
 */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FileText,
  Download,
  Smile,
  Copy,
  Check,
  FileSpreadsheet,
  FileCode,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import { toggleReaction } from '../../features/chat/chatSlice';
import { downloadAttachmentApi } from '../../features/chat/chatService';

export default function MessageItem({
  message,
  conversationId,
  isGrouped = false,
}) {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [copied, setCopied] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageBlobUrl, setImageBlobUrl] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  const isMe =
    Boolean(currentUser) &&
    ((currentUser?.id && message.senderId === currentUser.id) ||
      (currentUser?.facultyId && message.senderId === currentUser.facultyId) ||
      (currentUser?.email && message.senderId === currentUser.email));

  const senderDisplayName = isMe
    ? (currentUser.fullName ? `${currentUser.fullName} (You)` : 'You')
    : (message.senderName || message.senderId || 'Faculty Colleague');

  const senderInitials = isMe
    ? (currentUser.initials || (currentUser.fullName ? currentUser.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'ME'))
    : (message.senderInitials || (message.senderId ? message.senderId.slice(0, 2).toUpperCase() : 'FC'));

  const popularEmojis = ['👍', '❤️', '💡', '📝', '🚀', '🎉', '🙏', '☕'];

  const convId = conversationId || message.conversationId;
  const attId = message.attachmentId || message.attachment?.attachmentId;
  const attName = message.attachmentName || message.attachment?.name || 'attachment';
  const attType = (message.attachmentType || message.attachment?.type || (attName ? attName.split('.').pop() : ''))?.toLowerCase();
  const isImage =
    message.messageType === 'IMAGE' ||
    attType?.includes('image') ||
    ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(attType);

  // Authenticated image preview loader
  useEffect(() => {
    let active = true;
    let objectUrl = null;

    if (isImage && attId && convId) {
      downloadAttachmentApi(convId, attId)
        .then((response) => {
          if (!active) return;
          const blob = new Blob([response.data]);
          objectUrl = window.URL.createObjectURL(blob);
          setImageBlobUrl(objectUrl);
        })
        .catch((err) => {
          console.warn('Failed to load authenticated image preview:', err);
        });
    }

    return () => {
      active = false;
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [isImage, attId, convId]);

  const handleDownload = async () => {
    if (!attId || !convId) {
      if (imageBlobUrl) {
        const link = document.createElement('a');
        link.href = imageBlobUrl;
        link.download = attName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadError(null);
      const response = await downloadAttachmentApi(convId, attId);
      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = attName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.error('Download failed:', err);
      setDownloadError('Download failed');
      setTimeout(() => setDownloadError(null), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatFileSize = (size) => {
    if (!size) return '';
    if (typeof size === 'string' && (size.includes('MB') || size.includes('KB') || size.includes('B'))) {
      return size;
    }
    const num = Number(size);
    if (isNaN(num)) return size;
    if (num >= 1024 * 1024) {
      return `${(num / (1024 * 1024)).toFixed(1)} MB`;
    }
    if (num >= 1024) {
      return `${Math.round(num / 1024)} KB`;
    }
    return `${num} B`;
  };

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
          name={senderDisplayName}
          initials={senderInitials}
          size="md"
          rounded="xl"
          gradient={isMe ? 'from-purple-700 to-indigo-700' : message.senderAvatarColor}
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
              {senderDisplayName}
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
        {message.content && (
          <div className="text-sm text-slate-800 leading-relaxed break-words whitespace-pre-wrap font-normal">
            {message.content}
          </div>
        )}

        {/* ── ATTACHMENT DISPLAY (Image or File) ── */}
        {(message.attachment || message.attachmentId) && (
          <div className="mt-2.5 max-w-sm">
            {isImage ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-xs">
                {imageBlobUrl ? (
                  <div className="relative group/img">
                    <img
                      src={imageBlobUrl}
                      alt={attName}
                      className="max-h-64 w-auto rounded-t-xl object-contain bg-white mx-auto cursor-pointer"
                      onClick={handleDownload}
                      title="Click to download"
                    />
                    <div className="p-2 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-xs font-semibold text-slate-800 truncate" title={attName}>
                        {attName}
                      </div>
                      <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="p-1 rounded text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors shrink-0 cursor-pointer"
                        title="Download image"
                      >
                        {isDownloading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    <span>Loading image...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs hover:border-purple-300 transition-colors flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    {renderFileIcon(attType)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate" title={attName}>
                      {attName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatFileSize(message.attachmentSize || message.attachment?.size)} · Academic Document
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {downloadError && (
                    <span className="text-[10px] text-rose-600 font-medium">Failed</span>
                  )}
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                    title="Download file"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
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
