/**
 * Auth API service
 *
 * All auth-related HTTP calls go through this file.
 * Uses the centralised Axios instance and API constants.
 *
 * Backend contract:
 *   POST /api/auth/login    → { email, password }        → { token, tokenType, faculty }
 *   POST /api/auth/register → { facultyId, fullName, email, password, department, designation, subjects, profileImage, bio }
 *                                                         → FacultyResponse (201)
 *   GET  /api/profile/me    → (JWT required)              → FacultyResponse
 */

import axiosInstance from '../../services/api/axiosInstance';
import { AUTH_ENDPOINTS, PROFILE_ENDPOINTS } from '../../constants/api';

/**
 * Login — sends email+password, receives JWT + faculty profile.
 */
export const loginUser = (credentials) =>
  axiosInstance.post(AUTH_ENDPOINTS.LOGIN, credentials);

/**
 * Register — sends registration form data, receives created faculty profile.
 */
export const registerUser = (userData) =>
  axiosInstance.post(AUTH_ENDPOINTS.REGISTER, userData);

/**
 * Fetch the authenticated user's profile.
 * Requires a valid JWT in localStorage.
 */
export const fetchCurrentUser = () =>
  axiosInstance.get(PROFILE_ENDPOINTS.ME);
