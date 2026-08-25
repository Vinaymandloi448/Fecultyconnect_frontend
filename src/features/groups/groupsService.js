/**
 * Groups API service
 */

import axiosInstance from '../../services/api/axiosInstance';
import { GROUP_ENDPOINTS } from '../../constants/api';

export const getGroups = () =>
  axiosInstance.get(GROUP_ENDPOINTS.LIST);

export const getGroupById = (groupId) =>
  axiosInstance.get(GROUP_ENDPOINTS.DETAIL(groupId));

export const getGroupMembers = (groupId) =>
  axiosInstance.get(GROUP_ENDPOINTS.MEMBERS(groupId));
