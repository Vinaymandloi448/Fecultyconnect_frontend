/**
 * Groups API service
 */

import axiosInstance from '../../services/api/axiosInstance';
import { GROUP_ENDPOINTS } from '../../constants/api';

/**
 * List all groups accessible to the logged-in faculty
 * GET /api/groups
 */
export const getGroups = () =>
  axiosInstance.get(GROUP_ENDPOINTS.LIST);

/**
 * Get group details by groupId
 * GET /api/groups/{groupId}
 */
export const getGroupById = (groupId) =>
  axiosInstance.get(GROUP_ENDPOINTS.DETAIL(groupId));

/**
 * Create a new group
 * POST /api/groups
 * Body: { name, description, department, subject }
 */
export const createGroup = (groupData) =>
  axiosInstance.post(GROUP_ENDPOINTS.CREATE, groupData);

/**
 * Delete a group (creator only)
 * DELETE /api/groups/{groupId}
 */
export const deleteGroup = (groupId) =>
  axiosInstance.delete(GROUP_ENDPOINTS.DELETE(groupId));

/**
 * Add a member to a group
 * POST /api/groups/{groupId}/members/{facultyId}
 */
export const addGroupMember = (groupId, facultyId) =>
  axiosInstance.post(GROUP_ENDPOINTS.ADD_MEMBER(groupId, facultyId));

/**
 * Remove a member from a group
 * DELETE /api/groups/{groupId}/members/{facultyId}
 */
export const removeGroupMember = (groupId, facultyId) =>
  axiosInstance.delete(GROUP_ENDPOINTS.REMOVE_MEMBER(groupId, facultyId));

