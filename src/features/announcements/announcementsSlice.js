/**
 * Announcements Redux slice
 */

import { createSlice } from '@reduxjs/toolkit';
import { MOCK_ANNOUNCEMENTS } from '../../data/mockData';

const initialState = {
  announcements: MOCK_ANNOUNCEMENTS,
  selectedCategory: 'All',
  isLoading: false,
  error: null,
};

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    setCategoryFilter(state, action) {
      state.selectedCategory = action.payload;
    },
    markAnnouncementRead(state, action) {
      const item = state.announcements.find((a) => a.id === action.payload);
      if (item) {
        item.isRead = true;
      }
    },
    addAnnouncement(state, action) {
      state.announcements.unshift({
        id: 'ann-' + Date.now().toString().slice(-4),
        ...action.payload,
        date: 'Just now',
        timestamp: new Date().toISOString(),
        isRead: false,
      });
    },
  },
});

export const { setCategoryFilter, markAnnouncementRead, addAnnouncement } =
  announcementsSlice.actions;

export default announcementsSlice.reducer;
