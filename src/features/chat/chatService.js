/**
 * Chat API service
 */

import axiosInstance from '../../services/api/axiosInstance';
import { CHAT_ENDPOINTS } from '../../constants/api';

export const getConversations = () =>
  axiosInstance.get(CHAT_ENDPOINTS.CONVERSATIONS);

export const getMessages = (conversationId) =>
  axiosInstance.get(CHAT_ENDPOINTS.MESSAGES(conversationId));

export const sendMessage = (conversationId, data) =>
  axiosInstance.post(CHAT_ENDPOINTS.MESSAGES(conversationId), data);
