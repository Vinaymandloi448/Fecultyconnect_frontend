/**
 * Notifications Redux slice
 */

import { createSlice } from '@reduxjs/toolkit';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';

const initialNotifications = MOCK_NOTIFICATIONS;

const initialState = {
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter((n) => !n.isRead).length,
  selectedFilter: 'all', // 'all' | 'unread' | 'messages' | 'announcements'
  isLoading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
    addNotification(state, action) {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) state.unreadCount += 1;
    },
    markAsRead(state, action) {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead(state) {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    },
    setFilter(state, action) {
      state.selectedFilter = action.payload;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllRead,
  setFilter,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
