import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile, updateProfile } from './profileService';
import { updateProfile as updateAuthProfile } from '../auth/authSlice';

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfile();
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to load faculty profile.';
      return rejectWithValue(message);
    }
  },
);

export const updateFacultyProfile = createAsyncThunk(
  'profile/updateFacultyProfile',
  async (profileData, { dispatch, rejectWithValue }) => {
    try {
      const response = await updateProfile(profileData);
      // Sync into auth user
      dispatch(updateAuthProfile(response.data));
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to update profile. Please verify your details.';
      return rejectWithValue(message);
    }
  },
);

const initialState = {
  profileData: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  updateSuccess: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileStatus(state) {
      state.error = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileData = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // updateFacultyProfile
      .addCase(updateFacultyProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateFacultyProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profileData = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateFacultyProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
        state.updateSuccess = false;
      });
  },
});

export const { clearProfileStatus } = profileSlice.actions;

export default profileSlice.reducer;

