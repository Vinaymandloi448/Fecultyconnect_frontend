/**
 * MessageComposer — Slack-style message input with formatting and file upload
 */

import { useState, useRef } from 'react';
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
} from 'lucide-react';
import { sendMessage } from '../../features/chat/chatSlice';

export default function MessageComposer({
  conversationId,
  placeholder = 'Type a message...',
}) {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const quickEmojis = ['👍', '❤️', '💡', '📝', '🚀', '🎉', '🙏', '☕', '📚', '✅'];

  const handleSend = () => {
    if (!text.trim() && !attachedFile) return;

    const newMessage = {
      id: 'msg-' + Date.now(),
      senderId: currentUser?.id || 'fac-01',
      senderName: currentUser?.fullName || 'Faculty Member',
      senderDesignation: currentUser?.designation || 'Faculty',
      senderInitials: currentUser?.initials || 'FC',
      senderAvatarColor: currentUser?.avatarColor || 'from-purple-600 to-indigo-600',
      timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text.trim(),
      attachment: attachedFile
        ? {
            name: attachedFile.name,
            size: attachedFile.size,
            type: attachedFile.type,
          }
        : null,
      reactions: [],
    };

    dispatch(
      sendMessage({
        conversationId,
        message: newMessage,
      }),
    );

    setText('');
    setAttachedFile(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setAttachedFile({
        name: file.name,
        size: `${sizeMB} MB`,
        type: ext,
      });
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
      
      {/* ── ATTACHED FILE PREVIEW CHIP ── */}
      {attachedFile && (
        <div className="mb-2 flex items-center justify-between p-2 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900 max-w-sm">
          <div className="flex items-center gap-2 truncate">
            <FileText className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="font-semibold truncate">{attachedFile.name}</span>
            <span className="text-[11px] text-purple-600">({attachedFile.size})</span>
          </div>
          <button
            onClick={() => setAttachedFile(null)}
            className="p-1 hover:text-rose-600 transition-colors"
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

          {/* Right: Send button & keyboard hint */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[10px] text-slate-400">
              Return to send
            </span>
            <button
              type="button"
              onClick={handleSend}
              disabled={!text.trim() && !attachedFile}
              className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${
                text.trim() || attachedFile
                  ? 'bg-purple-700 hover:bg-purple-800 text-white shadow-xs cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <SendHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
