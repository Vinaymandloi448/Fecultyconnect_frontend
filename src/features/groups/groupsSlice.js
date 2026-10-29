/**
 * Groups Redux slice — connects with Spring Boot GroupController
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getGroups,
  getGroupById,
  createGroup,
  deleteGroup,
  addGroupMember,
  removeGroupMember,
} from './groupsService';

export const fetchGroups = createAsyncThunk(
  'groups/fetchGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getGroups();
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to fetch faculty groups.';
      return rejectWithValue(message);
    }
  },
);

export const createNewGroup = createAsyncThunk(
  'groups/createNewGroup',
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await createGroup(groupData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to create group. Please check required fields.';
      return rejectWithValue(message);
    }
  },
);

export const deleteExistingGroup = createAsyncThunk(
  'groups/deleteExistingGroup',
  async (groupId, { rejectWithValue }) => {
    try {
      await deleteGroup(groupId);
      return groupId;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to delete group. Only group creator can delete.';
      return rejectWithValue(message);
    }
  },
);

export const addMemberToGroup = createAsyncThunk(
  'groups/addMemberToGroup',
  async ({ groupId, facultyId }, { rejectWithValue }) => {
    try {
      const response = await addGroupMember(groupId, facultyId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to add member to group.';
      return rejectWithValue(message);
    }
  },
);

export const removeMemberFromGroup = createAsyncThunk(
  'groups/removeMemberFromGroup',
  async ({ groupId, facultyId }, { rejectWithValue }) => {
    try {
      const response = await removeGroupMember(groupId, facultyId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to remove member from group.';
      return rejectWithValue(message);
    }
  },
);

const initialState = {
  groups: [],
  activeGroup: null,
  isLoading: false,
  isCreating: false,
  error: null,
  successMessage: null,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setActiveGroup(state, action) {
      state.activeGroup = action.payload;
    },
    clearGroupsError(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchGroups
      .addCase(fetchGroups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // createNewGroup
      .addCase(createNewGroup.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createNewGroup.fulfilled, (state, action) => {
        state.isCreating = false;
        state.groups.unshift(action.payload);
        state.successMessage = `Group "${action.payload.name}" created successfully.`;
      })
      .addCase(createNewGroup.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      // deleteExistingGroup
      .addCase(deleteExistingGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter((g) => g.groupId !== action.payload);
        if (state.activeGroup?.groupId === action.payload) {
          state.activeGroup = null;
        }
        state.successMessage = 'Group deleted successfully.';
      })
      .addCase(deleteExistingGroup.rejected, (state, action) => {
        state.error = action.payload;
      })
      // addMemberToGroup
      .addCase(addMemberToGroup.fulfilled, (state, action) => {
        const index = state.groups.findIndex((g) => g.groupId === action.payload.groupId);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
        if (state.activeGroup?.groupId === action.payload.groupId) {
          state.activeGroup = action.payload;
        }
        state.successMessage = 'Member added successfully.';
      })
      .addCase(addMemberToGroup.rejected, (state, action) => {
        state.error = action.payload;
      })
      // removeMemberFromGroup
      .addCase(removeMemberFromGroup.fulfilled, (state, action) => {
        const index = state.groups.findIndex((g) => g.groupId === action.payload.groupId);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
        if (state.activeGroup?.groupId === action.payload.groupId) {
          state.activeGroup = action.payload;
        }
        state.successMessage = 'Member removed successfully.';
      })
      .addCase(removeMemberFromGroup.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setActiveGroup, clearGroupsError } = groupsSlice.actions;

export default groupsSlice.reducer;

