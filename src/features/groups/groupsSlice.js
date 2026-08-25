/**
 * Groups Redux slice
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  groups: [],
  activeGroup: null,
  isLoading: false,
  error: null,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups(state, action) {
      state.groups = action.payload;
    },
    setActiveGroup(state, action) {
      state.activeGroup = action.payload;
    },
    setGroupsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setGroupsError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setGroups, setActiveGroup, setGroupsLoading, setGroupsError } =
  groupsSlice.actions;

export default groupsSlice.reducer;
