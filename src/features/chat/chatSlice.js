/**
 * Chat Redux slice
 *
 * Manages: channels, direct messages, active conversation,
 * message history, reactions, details panel, and search.
 */

import { createSlice } from '@reduxjs/toolkit';
import { MOCK_CHANNELS, MOCK_FACULTY_MEMBERS, MOCK_MESSAGES } from '../../data/mockData';

const initialState = {
  channels: MOCK_CHANNELS,
  facultyMembers: MOCK_FACULTY_MEMBERS,
  messages: MOCK_MESSAGES,
  activeConversationId: 'general',
  activeConversationType: 'channel', // 'channel' | 'direct'
  isDetailsPanelOpen: false,
  searchQuery: '',
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation(state, action) {
      const { id, type } = action.payload;
      state.activeConversationId = id;
      state.activeConversationType = type || (id.startsWith('fac-') ? 'direct' : 'channel');

      // Clear unread count for the active channel if applicable
      const channel = state.channels.find((c) => c.id === id);
      if (channel) {
        channel.unreadCount = 0;
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

      const msg = convoMessages.find((m) => m.id === messageId);
      if (!msg) return;

      if (!msg.reactions) {
        msg.reactions = [];
      }

      const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
      if (existingReaction) {
        const userIndex = existingReaction.users.indexOf(userId);
        if (userIndex > -1) {
          // Remove reaction
          existingReaction.users.splice(userIndex, 1);
          existingReaction.count -= 1;
          if (existingReaction.count <= 0) {
            msg.reactions = msg.reactions.filter((r) => r.emoji !== emoji);
          }
        } else {
          // Add user to reaction
          existingReaction.users.push(userId);
          existingReaction.count += 1;
        }
      } else {
        // Add new emoji reaction
        msg.reactions.push({
          emoji,
          count: 1,
          users: [userId],
        });
      }
    },
    createChannel(state, action) {
      const newChannel = {
        id: action.payload.name.toLowerCase().replace(/\s+/g, '-'),
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
});

export const {
  setActiveConversation,
  sendMessage,
  toggleReaction,
  createChannel,
  toggleDetailsPanel,
  setDetailsPanelOpen,
  setSearchQuery,
} = chatSlice.actions;

export default chatSlice.reducer;
