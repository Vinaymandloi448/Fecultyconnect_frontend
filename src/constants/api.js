/**
 * API endpoint constants
 *
 * Centralised endpoint definitions to avoid hardcoded strings in
 * service files and slices. Group by feature domain.
 */

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
};

export const USER_ENDPOINTS = {
  ME: '/users/me',
  UPDATE_PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',
};

export const CHAT_ENDPOINTS = {
  CONVERSATIONS: '/chat/conversations',
  MESSAGES: (conversationId) => `/chat/conversations/${conversationId}/messages`,
};

export const GROUP_ENDPOINTS = {
  LIST: '/groups',
  DETAIL: (groupId) => `/groups/${groupId}`,
  MEMBERS: (groupId) => `/groups/${groupId}/members`,
};

export const DOCUMENT_ENDPOINTS = {
  LIST: '/documents',
  UPLOAD: '/documents/upload',
  DOWNLOAD: (documentId) => `/documents/${documentId}/download`,
};

export const ANNOUNCEMENT_ENDPOINTS = {
  LIST: '/announcements',
  CREATE: '/announcements',
  DETAIL: (id) => `/announcements/${id}`,
};

export const NOTIFICATION_ENDPOINTS = {
  LIST: '/notifications',
  MARK_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/read-all',
};
