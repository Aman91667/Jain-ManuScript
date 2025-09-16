// frontend/src/services/researcherService.ts

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const researcherAPI = axios.create({
  baseURL: API_BASE_URL,
});

researcherAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface UpgradeCredentials {
  phoneNumber: string;
  researchDescription: string;
  idProofFile: File;
}

export interface HelpRequestPayload {
  userId: string | undefined;
  userName: string | undefined;
  userEmail: string | undefined;
  manuscriptId?: string;
  message: string;
}

export class ResearcherService {
  async applyForResearcherStatus(credentials: UpgradeCredentials): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('phoneNumber', credentials.phoneNumber);
      formData.append('researchDescription', credentials.researchDescription);
      formData.append('idProofFile', credentials.idProofFile);

      await researcherAPI.post('/users/apply-researcher', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit application.');
    }
  }

  async submitHelpRequest(payload: HelpRequestPayload): Promise<void> {
    try {
      await researcherAPI.post('/help-requests', payload);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send help request.');
    }
  }
    
  async requestManuscriptAccess(manuscriptId: string): Promise<void> {
    try {
      // Sends the manuscriptId in the request body
      await researcherAPI.post('/access-requests', { manuscriptId });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to request access.');
    }
  }
}

export const researcherService = new ResearcherService();