/**
 * Redux store configuration
 *
 * Registers feature slices for auth, chat, documents, announcements, and notifications.
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import chatReducer from '../../features/chat/chatSlice';
import documentsReducer from '../../features/documents/documentsSlice';
import announcementsReducer from '../../features/announcements/announcementsSlice';
import notificationsReducer from '../../features/notifications/notificationsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    documents: documentsReducer,
    announcements: announcementsReducer,
    notifications: notificationsReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
