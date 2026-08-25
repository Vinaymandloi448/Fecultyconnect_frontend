/**
 * Route path constants
 *
 * Define all route paths here so they can be referenced consistently
 * in the router config and in navigation links / redirects.
 */

const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  DASHBOARD: '/dashboard',

  CHAT: '/chat',
  CHAT_CONVERSATION: '/chat/:conversationId',

  GROUPS: '/groups',
  GROUP_DETAIL: '/groups/:groupId',

  DOCUMENTS: '/documents',

  ANNOUNCEMENTS: '/announcements',

  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',

  NOTIFICATIONS: '/notifications',
};

export default ROUTES;
