/**
 * Documents / Files Redux slice
 */

import { createSlice } from '@reduxjs/toolkit';
import { MOCK_FILES } from '../../data/mockData';

const initialState = {
  documents: MOCK_FILES,
  selectedCategory: 'All',
  searchQuery: '',
  isLoading: false,
  error: null,
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    addDocument(state, action) {
      state.documents.unshift({
        id: 'file-' + Date.now().toString().slice(-4),
        ...action.payload,
        uploadDate: 'Just now',
        downloads: 0,
      });
    },
  },
});

export const { setSelectedCategory, setSearchQuery, addDocument } =
  documentsSlice.actions;

export default documentsSlice.reducer;
