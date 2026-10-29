/**
 * Chat API service
 */

import axiosInstance from '../../services/api/axiosInstance';
import { CONVERSATION_ENDPOINTS } from '../../constants/api';

/**
 * List all conversations of the logged-in faculty
 * GET /api/conversations
 */
export const getConversations = () =>
  axiosInstance.get(CONVERSATION_ENDPOINTS.LIST);

/**
 * Get single conversation by ID
 * GET /api/conversations/{conversationId}
 */
export const getConversationById = (conversationId) =>
  axiosInstance.get(CONVERSATION_ENDPOINTS.DETAIL(conversationId));

/**
 * Create or get conversation with another faculty member
 * POST /api/conversations
 * Body: { facultyId: "FAC002" }
 */
export const createConversation = (facultyId) =>
  axiosInstance.post(CONVERSATION_ENDPOINTS.CREATE, { facultyId });

/**
 * Get message history for a conversation
 * GET /api/conversations/{conversationId}/messages
 */
export const getMessages = (conversationId) =>
  axiosInstance.get(CONVERSATION_ENDPOINTS.MESSAGES(conversationId));

/**
 * Send a message via REST
 * POST /api/conversations/{conversationId}/messages
 * Body: { content: "Hello" }
 */
export const sendMessageApi = (conversationId, content) =>
  axiosInstance.post(CONVERSATION_ENDPOINTS.SEND_MESSAGE(conversationId), { content });

/**
 * Upload an attachment (image or PDF/document)
 * POST /api/conversations/{conversationId}/attachments
 * FormData fields: file (required), content (optional)
 */
export const uploadAttachmentApi = (conversationId, file, content) => {
  const formData = new FormData();
  formData.append('file', file);
  if (content && typeof content === 'string' && content.trim()) {
    formData.append('content', content.trim());
  }
  // Let browser and Axios generate Content-Type with multipart boundary automatically
  return axiosInstance.post(CONVERSATION_ENDPOINTS.ATTACHMENTS(conversationId), formData, {
    headers: {
      'Content-Type': undefined,
    },
  });
};

/**
 * Download or stream an attachment blob
 * GET /api/conversations/{conversationId}/attachments/{attachmentId}
 */
export const downloadAttachmentApi = (conversationId, attachmentId) =>
  axiosInstance.get(CONVERSATION_ENDPOINTS.ATTACHMENT_DOWNLOAD(conversationId, attachmentId), {
    responseType: 'blob',
  });

