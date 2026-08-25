/**
 * Announcements API service
 */

import axiosInstance from '../../services/api/axiosInstance';
import { ANNOUNCEMENT_ENDPOINTS } from '../../constants/api';

export const getAnnouncements = () =>
  axiosInstance.get(ANNOUNCEMENT_ENDPOINTS.LIST);

export const createAnnouncement = (data) =>
  axiosInstance.post(ANNOUNCEMENT_ENDPOINTS.CREATE, data);

export const getAnnouncementById = (id) =>
  axiosInstance.get(ANNOUNCEMENT_ENDPOINTS.DETAIL(id));
