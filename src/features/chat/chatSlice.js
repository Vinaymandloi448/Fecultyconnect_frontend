/**
 * Chat Redux slice
 *
 * Manages: channels, direct conversations, active conversation,
 * message history from Spring Boot REST & STOMP WebSocket, and message deduplication.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getConversations,
  getConversationById,
  createConversation,
  getMessages,
  sendMessageApi,
} from './chatService';
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

// Format raw backend MessageResponse into UI format
export const normalizeMessage = (msg) => {
  const timeStr = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Just now';

  return {
    id: msg.messageId || msg.id || 'msg-' + Date.now(),
    messageId: msg.messageId || msg.id,
    conversationId: msg.conversationId,
    senderId: msg.senderId,
    receiverId: msg.receiverId,
    content: msg.content,
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

const initialState = {
  channels: MOCK_CHANNELS,
  facultyMembers: MOCK_FACULTY_MEMBERS,
  conversations: [], // Backend ConversationResponse list
  messages: { ...MOCK_MESSAGES },
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
      const exists = state.messages[convId].some(
        (m) =>
          (m.messageId && norm.messageId && m.messageId === norm.messageId) ||
          (m.id && norm.id && m.id === norm.id) ||
          (m.messageId && norm.id && m.messageId === norm.id) ||
          (m.id && norm.messageId && m.id === norm.messageId),
      );

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

      const msg = convoMessages.find((m) => m.id === messageId || m.messageId === messageId);
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
  },
  extraReducers: (builder) => {
    builder
      // fetchConversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // createNewConversation
      .addCase(createNewConversation.fulfilled, (state, action) => {
        const conv = action.payload;
        const exists = state.conversations.some((c) => c.conversationId === conv.conversationId);
        if (!exists) {
          state.conversations.unshift(conv);
        }
      })
      // fetchMessages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoadingMessages = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        const { conversationId, messages } = action.payload;
        state.messages[conversationId] = messages.map(normalizeMessage);
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoadingMessages = false;
        state.error = action.payload;
      })
      // sendChatMessage
      .addCase(sendChatMessage.pending, (state) => {
        state.isSendingMessage = true;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isSendingMessage = false;
        const norm = normalizeMessage(action.payload);
        const convId = norm.conversationId;
        if (!state.messages[convId]) {
          state.messages[convId] = [];
        }
        // Deduplicate
        const exists = state.messages[convId].some(
          (m) =>
            (m.messageId && norm.messageId && m.messageId === norm.messageId) ||
            (m.id && norm.id && m.id === norm.id) ||
            (m.messageId && norm.id && m.messageId === norm.id) ||
            (m.id && norm.messageId && m.id === norm.messageId),
        );
        if (!exists) {
          state.messages[convId].push(norm);
        }
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isSendingMessage = false;
        state.error = action.payload;
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
} = chatSlice.actions;

export default chatSlice.reducer;

