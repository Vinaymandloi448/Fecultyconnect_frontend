/**
 * FacultyConnect Route Constants
 *
 * Defines canonical paths across the application.
 */

const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Workspace Authenticated Routes
  DASHBOARD: '/dashboard',
  GROUPS: '/dashboard/groups',
  CHANNEL: '/dashboard/channels/:channelId',
  MESSAGE: '/dashboard/messages/:userId',
  FILES: '/dashboard/files',
  ANNOUNCEMENTS: '/dashboard/announcements',
  NOTIFICATIONS: '/dashboard/notifications',
  PROFILE: '/dashboard/profile',
  CHAT: '/dashboard/channels/general',

  // Helper url builders
  channelUrl: (channelId) => `/dashboard/channels/${channelId}`,
  messageUrl: (userId) => `/dashboard/messages/${userId}`,
};

export default ROUTES;
