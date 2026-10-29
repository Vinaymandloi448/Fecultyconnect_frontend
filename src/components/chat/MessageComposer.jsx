/**
 * MessageComposer — Slack-style message input with formatting and file upload
 */

import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  Paperclip,
  Smile,
  SendHorizontal,
  X,
  FileText,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { sendMessage, sendChatMessage, sendAttachmentMessage } from '../../features/chat/chatSlice';
import useStomp from '../../hooks/useStomp';

const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv'];

export default function MessageComposer({
  conversationId,
  placeholder = 'Type a message...',
}) {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { conversations, isSendingMessage } = useSelector((state) => state.chat);
  const { isConnected, send } = useStomp();

  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [rawFile, setRawFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const quickEmojis = ['👍', '❤️', '💡', '📝', '🚀', '🎉', '🙏', '☕', '📚', '✅'];

  // Check if target is a backend conversation (starts with CONV- or in conversations list or not chan-)
  const isBackendConv =
    conversationId &&
    (conversationId.startsWith('CONV-') ||
      conversations.some((c) => c.conversationId === conversationId) ||
      (!conversationId.startsWith('chan-') && conversationId !== 'general'));

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (filePreview?.previewUrl) {
        URL.revokeObjectURL(filePreview.previewUrl);
      }
    };
  }, [filePreview]);

  const handleRemoveAttachment = () => {
    if (filePreview?.previewUrl) {
      URL.revokeObjectURL(filePreview.previewUrl);
    }
    setRawFile(null);
    setFilePreview(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setFileError(`File type .${ext} is not supported. Allowed formats: PDF, JPG, PNG, WEBP, DOCX, XLSX.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > MAX_ATTACHMENT_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileError(`File size (${sizeMB} MB) exceeds maximum allowed limit of 5 MB.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const isImg = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
    setRawFile(file);
    setFilePreview({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: ext,
      isImage: isImg,
      previewUrl: isImg ? URL.createObjectURL(file) : null,
    });
  };

  const handleSend = async () => {
    if (!text.trim() && !rawFile) return;
    const content = text.trim();

    if (rawFile) {
      if (isBackendConv) {
        try {
          await dispatch(
            sendAttachmentMessage({
              conversationId,
              file: rawFile,
              content,
            }),
          ).unwrap();
        } catch (err) {
          setFileError(typeof err === 'string' ? err : 'Failed to upload attachment.');
          return;
        }
      } else {
        // Mock fallback
        const newMessage = {
          id: 'msg-' + Date.now(),
          conversationId,
          senderId: currentUser?.id || currentUser?.facultyId || 'fac-01',
          senderName: currentUser?.fullName || 'Faculty Member',
          senderDesignation: currentUser?.designation || 'Faculty',
          senderInitials: currentUser?.initials || 'FC',
          senderAvatarColor: currentUser?.avatarColor || 'from-purple-600 to-indigo-600',
          timestamp:
            'Today at ' +
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content,
          attachment: {
            name: rawFile.name,
            size: filePreview?.size || `${(rawFile.size / (1024 * 1024)).toFixed(2)} MB`,
            type: filePreview?.type || 'file',
          },
          reactions: [],
        };

        dispatch(
          sendMessage({
            conversationId,
            message: newMessage,
          }),
        );
      }
      handleRemoveAttachment();
      setText('');
    } else {
      // Normal text message
      if (isBackendConv) {
        if (isConnected) {
          // Preferred real-time send path via STOMP /app/chat.send
          const sent = send(conversationId, content);
          if (!sent) {
            // Fallback to REST if STOMP publish fails
            dispatch(sendChatMessage({ conversationId, content }));
          }
        } else {
          // Fallback to REST when STOMP is offline
          dispatch(sendChatMessage({ conversationId, content }));
        }
      } else {
        // Mock / Local channel fallback
        const newMessage = {
          id: 'msg-' + Date.now(),
          senderId: currentUser?.id || currentUser?.facultyId || 'fac-01',
          senderName: currentUser?.fullName || 'Faculty Member',
          senderDesignation: currentUser?.designation || 'Faculty',
          senderInitials: currentUser?.initials || 'FC',
          senderAvatarColor: currentUser?.avatarColor || 'from-purple-600 to-indigo-600',
          timestamp:
            'Today at ' +
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content,
          reactions: [],
        };

        dispatch(
          sendMessage({
            conversationId,
            message: newMessage,
          }),
        );
      }
      setText('');
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const wrapText = (symbol) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = text.substring(start, end);
    const replacement = `${symbol}${selected || 'text'}${symbol}`;
    setText(text.substring(0, start) + replacement + text.substring(end));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + symbol.length, end + symbol.length);
    }, 0);
  };

  return (
    <div className="p-4 bg-white border-t border-slate-200 select-none">
      
      {/* ── ATTACHMENT ERROR BANNER ── */}
      {fileError && (
        <div className="mb-2 flex items-center justify-between p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{fileError}</span>
          </div>
          <button
            onClick={() => setFileError(null)}
            className="p-1 hover:text-rose-900 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── ATTACHED FILE PREVIEW CHIP ── */}
      {filePreview && (
        <div className="mb-2 flex items-center justify-between p-2 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900 max-w-md">
          <div className="flex items-center gap-2 truncate">
            {filePreview.isImage && filePreview.previewUrl ? (
              <img
                src={filePreview.previewUrl}
                alt="Preview"
                className="w-8 h-8 rounded object-cover border border-purple-200 shrink-0"
              />
            ) : (
              <FileText className="w-4 h-4 text-purple-600 shrink-0" />
            )}
            <span className="font-semibold truncate">{filePreview.name}</span>
            <span className="text-[11px] text-purple-600">({filePreview.size})</span>
          </div>
          <button
            onClick={handleRemoveAttachment}
            className="p-1 hover:text-rose-600 transition-colors cursor-pointer"
            title="Remove attachment"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── COMPOSER CONTAINER ── */}
      <div className="rounded-xl border border-slate-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 transition-all bg-white shadow-xs overflow-hidden">
        
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-slate-100 bg-slate-50/70 text-slate-500">
          <button
            type="button"
            onClick={() => wrapText('**')}
            className="p-1.5 rounded-md hover:bg-slate-200/70 hover:text-slate-800 transition-colors"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => wrapText('*')}
            className="p-1.5 rounded-md hover:bg-slate-200/70 hover:text-slate-800 transition-colors"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => wrapText('~')}
            className="p-1.5 rounded-md hover:bg-slate-200/70 hover:text-slate-800 transition-colors"
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3.5 bg-slate-200 mx-1" />
          <button
            type="button"
            onClick={() => wrapText('`')}
            className="p-1.5 rounded-md hover:bg-slate-200/70 hover:text-slate-800 transition-colors"
            title="Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setText((prev) => prev + '\n- ')}
            className="p-1.5 rounded-md hover:bg-slate-200/70 hover:text-slate-800 transition-colors"
            title="Bullet list"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none max-h-40 min-h-[56px] leading-relaxed"
        />

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-1">
            {/* Hidden real file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
              className="hidden"
            />

            {/* File attach button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
              title="Attach academic file or document"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Emoji toggle button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                title="Add emoji"
              >
                <Smile className="w-4 h-4" />
              </button>

              {/* Quick Emoji Picker Popover */}
              {showEmojiPicker && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowEmojiPicker(false)}
                  />
                  <div className="absolute left-0 bottom-10 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 flex items-center gap-1.5 animate-slideDown">
                    {quickEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="p-1.5 rounded-lg hover:bg-purple-100 text-lg transition-transform hover:scale-125 cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Transport selector, Send button & keyboard hint */}
          <div className="flex items-center gap-2">
            {isBackendConv && (
              <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold border transition-all ${
                  isConnected
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
                title={
                  isConnected
                    ? 'Messages sent in real-time via STOMP /app/chat.send'
                    : 'STOMP disconnected: messages sent via REST fallback'
                }
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span>{isConnected ? 'STOMP Live' : 'REST Fallback'}</span>
              </div>
            )}

            <span className="hidden sm:inline text-[10px] text-slate-400">
              Return to send
            </span>
            <button
              type="button"
              onClick={handleSend}
              disabled={(!text.trim() && !rawFile) || isSendingMessage}
              className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                text.trim() || rawFile
                  ? 'bg-purple-700 hover:bg-purple-800 text-white shadow-xs cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              title="Send message"
            >
              {isSendingMessage ? (
                <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
              ) : (
                <SendHorizontal className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
