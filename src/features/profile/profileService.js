/**
 * Profile API service
 */

import axiosInstance from '../../services/api/axiosInstance';
import { PROFILE_ENDPOINTS } from '../../constants/api';

/**
 * Get current faculty profile
 * GET /api/profile/me
 */
export const getProfile = () =>
  axiosInstance.get(PROFILE_ENDPOINTS.ME);

/**
 * Update current faculty profile
 * PUT /api/profile/me
 * Body: { fullName, department, designation, subjects, profileImage, bio }
 */
export const updateProfile = (data) =>
  axiosInstance.put(PROFILE_ENDPOINTS.UPDATE, data);

