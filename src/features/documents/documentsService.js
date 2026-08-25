/**
 * Documents API service
 */

import axiosInstance from '../../services/api/axiosInstance';
import { DOCUMENT_ENDPOINTS } from '../../constants/api';

export const getDocuments = () =>
  axiosInstance.get(DOCUMENT_ENDPOINTS.LIST);

export const uploadDocument = (formData) =>
  axiosInstance.post(DOCUMENT_ENDPOINTS.UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const downloadDocument = (documentId) =>
  axiosInstance.get(DOCUMENT_ENDPOINTS.DOWNLOAD(documentId), {
    responseType: 'blob',
  });
