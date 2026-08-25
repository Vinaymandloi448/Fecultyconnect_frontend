/**
 * Profile API service
 */

import axiosInstance from '../../services/api/axiosInstance';
import { USER_ENDPOINTS } from '../../constants/api';

export const getProfile = () =>
  axiosInstance.get(USER_ENDPOINTS.ME);

export const updateProfile = (data) =>
  axiosInstance.patch(USER_ENDPOINTS.UPDATE_PROFILE, data);

export const changePassword = (data) =>
  axiosInstance.post(USER_ENDPOINTS.CHANGE_PASSWORD, data);
