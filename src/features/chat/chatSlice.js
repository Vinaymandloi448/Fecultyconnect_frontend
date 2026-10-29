/**
 * Chat Redux slice
 *
 * Manages: channels, direct conversations, active conversation,
 * message history from Spring Boot REST & STOMP WebSocket, and bidirectional message deduplication.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getConversations,
  getConversationById,
  createConversation,
  getMessages,
  sendMessageApi,
  uploadAttachmentApi,
} from './chatService';
import { logout } from '../auth/authSlice';
import { MOCK_CHANNELS, MOCK_FACULTY_MEMBERS, MOCK_MESSAGES } from '../../data/mockData';

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getConversations();
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to fetch conversations.';
      return rejectWithValue(message);
    }
  },
);

export const createNewConversation = createAsyncThunk(
  'chat/createNewConversation',
  async (facultyId, { rejectWithValue }) => {
    try {
      const response = await createConversation(facultyId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to start conversation. Please check the Faculty ID.';
      return rejectWithValue(message);
    }
  },
);

export const fetchConversationById = createAsyncThunk(
  'chat/fetchConversationById',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await getConversationById(conversationId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Conversation not found.';
      return rejectWithValue(message);
    }
  },
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await getMessages(conversationId);
      return { conversationId, messages: response.data };
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to load message history.';
      return rejectWithValue(message);
    }
  },
);

export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  async ({ conversationId, content }, { rejectWithValue }) => {
    try {
      const response = await sendMessageApi(conversationId, content);
      return {
        ...response.data,
        conversationId: response.data?.conversationId || conversationId,
      };
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to send message.';
      return rejectWithValue(message);
    }
  },
);

export const sendAttachmentMessage = createAsyncThunk(
  'chat/sendAttachmentMessage',
  async ({ conversationId, file, content }, { rejectWithValue }) => {
    try {
      const response = await uploadAttachmentApi(conversationId, file, content);
      return {
        ...response.data,
        conversationId: response.data?.conversationId || conversationId,
      };
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        (error.response?.status === 413 ? 'File exceeds maximum upload limit of 5 MB.' : 'Failed to upload attachment.');
      return rejectWithValue(message);
    }
  },
);

// Format raw backend MessageResponse into UI format
export const normalizeMessage = (msg) => {
  const timeStr = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Just now';

  const mId = msg.messageId || msg.id;

  const attId = msg.attachmentId || msg.attachment?.attachmentId;
  const attName = msg.attachmentName || msg.attachment?.name || msg.attachment?.attachmentName || msg.fileName;
  const attType = msg.attachmentType || msg.attachment?.type || msg.attachment?.attachmentType || (attName ? attName.split('.').pop().toLowerCase() : null);
  const attSize = msg.attachmentSize || msg.attachment?.size || msg.attachment?.attachmentSize;
  const attUrl = msg.attachmentUrl || msg.attachment?.url;

  return {
    id: mId || ('msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7)),
    messageId: mId,
    conversationId: msg.conversationId,
    senderId: msg.senderId,
    receiverId: msg.receiverId,
    content: msg.content,
    messageType: msg.messageType || (attId ? 'FILE' : 'TEXT'),
    attachmentId: attId,
    attachmentName: attName,
    attachmentType: attType,
    attachmentSize: attSize,
    attachmentUrl: attUrl,
    attachment: (attId || attName) ? {
      attachmentId: attId,
      name: attName,
      type: attType,
      size: attSize,
      url: attUrl,
    } : null,
    status: msg.status || 'SENT',
    createdAt: msg.createdAt,
    timestamp: 'Today at ' + timeStr,
    senderName: msg.senderName || msg.senderId || 'Faculty Colleague',
    senderDesignation: msg.senderDesignation || 'Faculty',
    senderInitials: msg.senderId
      ? msg.senderId.slice(0, 2).toUpperCase()
      : 'FC',
    senderAvatarColor: 'from-purple-600 to-indigo-600',
    reactions: msg.reactions || [],
  };
};

/**
 * Deduplicate comparison between two messages
 */
export const isDuplicateMessage = (m1, m2) => {
  if (!m1 || !m2) return false;
  if (m1.messageId && m2.messageId && m1.messageId === m2.messageId) return true;
  if (m1.id && m2.id && m1.id === m2.id) return true;
  if (m1.messageId && m2.id && m1.messageId === m2.id) return true;
  if (m1.id && m2.messageId && m1.id === m2.messageId) return true;
  return false;
};

const initialState = {
  channels: MOCK_CHANNELS,
  facultyMembers: MOCK_FACULTY_MEMBERS,
  conversations: [],
  messages: {
    general: MOCK_MESSAGES.general || [],
    announcements: MOCK_MESSAGES.announcements || [],
    'computer-science': MOCK_MESSAGES['computer-science'] || [],
    'examination-updates': MOCK_MESSAGES['examination-updates'] || [],
    'faculty-resources': MOCK_MESSAGES['faculty-resources'] || [],
  },
  activeConversationId: 'general',
  activeConversationType: 'channel', // 'channel' | 'direct'
  isDetailsPanelOpen: false,
  searchQuery: '',
  isLoading: false,
  isLoadingMessages: false,
  isSendingMessage: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation(state, action) {
      const { id, type } = action.payload;
      state.activeConversationId = id;
      state.activeConversationType =
        type || (id.startsWith('CONV-') || id.startsWith('fac-') ? 'direct' : 'channel');

      // Clear unread count for the active channel if applicable
      const channel = state.channels.find((c) => c.id === id);
      if (channel) {
        channel.unreadCount = 0;
      }
    },
    // Handler for messages received via WebSocket STOMP
    messageReceived(state, action) {
      const rawMsg = action.payload;
      if (!rawMsg || !rawMsg.conversationId) return;

      const norm = normalizeMessage(rawMsg);
      const convId = norm.conversationId;

      if (!state.messages[convId]) {
        state.messages[convId] = [];
      }

      // Check for duplicates by messageId or id
      const exists = state.messages[convId].some((m) => isDuplicateMessage(m, norm));

      if (!exists) {
        state.messages[convId].push(norm);
      }
    },
    sendMessage(state, action) {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
    },
    toggleReaction(state, action) {
      const { conversationId, messageId, emoji, userId } = action.payload;
      const convoMessages = state.messages[conversationId];
      if (!convoMessages) return;

      const msg = convoMessages.find((m) => isDuplicateMessage(m, { messageId, id: messageId }));
      if (!msg) return;

      if (!msg.reactions) {
        msg.reactions = [];
      }

      const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
      if (existingReaction) {
        const userIndex = existingReaction.users.indexOf(userId);
        if (userIndex > -1) {
          existingReaction.users.splice(userIndex, 1);
          existingReaction.count -= 1;
          if (existingReaction.count <= 0) {
            msg.reactions = msg.reactions.filter((r) => r.emoji !== emoji);
          }
        } else {
          existingReaction.users.push(userId);
          existingReaction.count += 1;
        }
      } else {
        msg.reactions.push({
          emoji,
          count: 1,
          users: [userId],
        });
      }
    },
    createChannel(state, action) {
      const newChannel = {
        id: action.payload.id || action.payload.name.toLowerCase().replace(/\s+/g, '-'),
        name: action.payload.name.toLowerCase().replace(/\s+/g, '-'),
        displayName: action.payload.name,
        description: action.payload.description || 'Channel for faculty coordination',
        topic: action.payload.topic || action.payload.description || 'Faculty coordination',
        department: action.payload.department || 'General',
        isPrivate: Boolean(action.payload.isPrivate),
        memberCount: 1,
        unreadCount: 0,
        members: ['fac-01'],
        createdAt: 'Just now',
      };
      state.channels.push(newChannel);
      state.messages[newChannel.id] = [
        {
          id: 'welcome-' + newChannel.id,
          senderId: 'fac-01',
          senderName: 'System / FacultyConnect',
          senderDesignation: 'Workspace Bot',
          senderInitials: 'FC',
          senderAvatarColor: 'from-purple-600 to-indigo-600',
          timestamp: 'Just now',
          content: `Welcome to the beginning of the #${newChannel.name} channel. Start collaborating with fellow department members!`,
          reactions: [],
        },
      ];
    },
    toggleDetailsPanel(state) {
      state.isDetailsPanelOpen = !state.isDetailsPanelOpen;
    },
    setDetailsPanelOpen(state, action) {
      state.isDetailsPanelOpen = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    clearChatError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchConversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload || [];
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // createNewConversation
      .addCase(createNewConversation.fulfilled, (state, action) => {
        const conv = action.payload;
        if (!conv) return;
        const exists = state.conversations.some((c) => c.conversationId === conv.conversationId);
        if (!exists) {
          state.conversations.unshift(conv);
        }
      })
      // fetchConversationById
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        const conv = action.payload;
        if (!conv) return;
        const exists = state.conversations.some((c) => c.conversationId === conv.conversationId);
        if (!exists) {
          state.conversations.unshift(conv);
        }
      })
      // fetchMessages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoadingMessages = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        const { conversationId, messages } = action.payload;
        const fetchedNormalized = (messages || []).map(normalizeMessage);

        const currentList = state.messages[conversationId] || [];

        // Bidirectional deduplication: merge fetched REST messages with any WebSocket messages
        // that may have arrived while fetchMessages was in-flight
        const merged = [...fetchedNormalized];
        currentList.forEach((existing) => {
          const alreadyInMerged = merged.some((m) => isDuplicateMessage(m, existing));
          if (!alreadyInMerged) {
            merged.push(existing);
          }
        });

        // Preserve chronological order
        merged.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
          return 0;
        });

        state.messages[conversationId] = merged;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoadingMessages = false;
        state.error = action.payload;
        const convId = action.meta?.arg;
        if (convId) {
          state.messages[convId] = [];
        }
      })
      // sendChatMessage
      .addCase(sendChatMessage.pending, (state) => {
        state.isSendingMessage = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isSendingMessage = false;
        const norm = normalizeMessage(action.payload);
        const convId = norm.conversationId;
        if (!state.messages[convId]) {
          state.messages[convId] = [];
        }
        // Deduplicate against existing messages
        const exists = state.messages[convId].some((m) => isDuplicateMessage(m, norm));
        if (!exists) {
          state.messages[convId].push(norm);
        }
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isSendingMessage = false;
        state.error = action.payload;
      })
      // sendAttachmentMessage
      .addCase(sendAttachmentMessage.pending, (state) => {
        state.isSendingMessage = true;
        state.error = null;
      })
      .addCase(sendAttachmentMessage.fulfilled, (state, action) => {
        state.isSendingMessage = false;
        const norm = normalizeMessage(action.payload);
        const convId = norm.conversationId;
        if (!state.messages[convId]) {
          state.messages[convId] = [];
        }
        const exists = state.messages[convId].some((m) => isDuplicateMessage(m, norm));
        if (!exists) {
          state.messages[convId].push(norm);
        }
      })
      .addCase(sendAttachmentMessage.rejected, (state, action) => {
        state.isSendingMessage = false;
        state.error = action.payload;
      })
      // logout
      .addCase(logout, (state) => {
        state.conversations = [];
        state.messages = {};
        state.activeConversationId = 'general';
        state.error = null;
      });
  },
});

export const {
  setActiveConversation,
  messageReceived,
  sendMessage,
  toggleReaction,
  createChannel,
  toggleDetailsPanel,
  setDetailsPanelOpen,
  setSearchQuery,
  clearChatError,
} = chatSlice.actions;

export default chatSlice.reducer;
