/**
 * API endpoint constants
 *
 * Centralised endpoint definitions to avoid hardcoded strings in
 * service files and slices. Group by feature domain.
 *
 * NOTE: These are relative paths appended to env.API_BASE_URL
 * which already includes /api, so paths here should NOT start with /api.
 *
 * Backend routes (Spring Boot @RequestMapping):
 *   /api/auth/*            → AuthController
 *   /api/profile/*         → ProfileController
 *   /api/conversations/*   → ConversationController
 *   /api/conversations/{id}/messages → MessageController
 *   /api/groups/*          → GroupController
 */

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
};

export const PROFILE_ENDPOINTS = {
  ME: '/profile/me',
  UPDATE: '/profile/me',
};

export const CONVERSATION_ENDPOINTS = {
  LIST: '/conversations',
  CREATE: '/conversations',
  DETAIL: (conversationId) => `/conversations/${conversationId}`,
  MESSAGES: (conversationId) => `/conversations/${conversationId}/messages`,
  SEND_MESSAGE: (conversationId) => `/conversations/${conversationId}/messages`,
};

export const GROUP_ENDPOINTS = {
  LIST: '/groups',
  CREATE: '/groups',
  DETAIL: (groupId) => `/groups/${groupId}`,
  DELETE: (groupId) => `/groups/${groupId}`,
  ADD_MEMBER: (groupId, facultyId) => `/groups/${groupId}/members/${facultyId}`,
  REMOVE_MEMBER: (groupId, facultyId) => `/groups/${groupId}/members/${facultyId}`,
};
