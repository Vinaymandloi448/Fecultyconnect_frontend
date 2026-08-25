/**
 * Documents Redux slice
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documents: [],
  isLoading: false,
  error: null,
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setDocuments(state, action) {
      state.documents = action.payload;
    },
    setDocumentsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setDocumentsError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setDocuments, setDocumentsLoading, setDocumentsError } =
  documentsSlice.actions;

export default documentsSlice.reducer;
