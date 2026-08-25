/**
 * Notifications API service
 */

import axiosInstance from '../../services/api/axiosInstance';
import { NOTIFICATION_ENDPOINTS } from '../../constants/api';

export const getNotifications = () =>
  axiosInstance.get(NOTIFICATION_ENDPOINTS.LIST);

export const markNotificationRead = (id) =>
  axiosInstance.patch(NOTIFICATION_ENDPOINTS.MARK_READ(id));

export const markAllNotificationsRead = () =>
  axiosInstance.patch(NOTIFICATION_ENDPOINTS.MARK_ALL_READ);
