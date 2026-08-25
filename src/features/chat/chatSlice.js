/**
 * Chat Redux slice
 *
 * Manages: conversations list, active conversation, messages, typing indicators.
 * Chat UI will be split into multiple components (sidebar, message list, input, etc.)
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  activeConversationId: null,
  messages: {},        // keyed by conversationId
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations(state, action) {
      state.conversations = action.payload;
    },
    setActiveConversation(state, action) {
      state.activeConversationId = action.payload;
    },
    addMessage(state, action) {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
    },
    setMessages(state, action) {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },
    setChatLoading(state, action) {
      state.isLoading = action.payload;
    },
    setChatError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setConversations,
  setActiveConversation,
  addMessage,
  setMessages,
  setChatLoading,
  setChatError,
} = chatSlice.actions;

export default chatSlice.reducer;
