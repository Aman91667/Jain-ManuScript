import { api, FILE_BASE_URL } from '@/config/api';

export interface Manuscript {
  _id: string;
  title: string;
  description: string;
  category: string;
  visibility: 'public' | 'researcher';
  language: string;
  period: string;
  author: string;
  keywords: string[];
  uploadType: 'normal' | 'detailed';
  files: string[];
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export const manuscriptService = {
  getPublicManuscripts: async (): Promise<Manuscript[]> => {
    try {
      const res = await api.get<Manuscript[]>('/manuscripts/public');
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch public manuscripts');
    }
  },

  getResearcherManuscripts: async (): Promise<Manuscript[]> => {
    try {
      const res = await api.get<Manuscript[]>('/manuscripts/researcher');
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch researcher manuscripts');
    }
  },

  getAllManuscripts: async (): Promise<Manuscript[]> => {
    try {
      const res = await api.get<Manuscript[]>('/manuscripts/admin');
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch all manuscripts');
    }
  },

  getManuscriptById: async (id: string): Promise<Manuscript> => {
    try {
      const res = await api.get<Manuscript>(`/manuscripts/${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch manuscript');
    }
  },

  deleteManuscript: async (id: string): Promise<{ message: string }> => {
    try {
      const res = await api.delete<{ message: string }>(`/manuscripts/${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to delete manuscript');
    }
  },

  updateManuscript: async (
    id: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<Manuscript> => {
    try {
      const res = await api.put<{ data: Manuscript }>(`/manuscripts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
      });
      return res.data.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to update manuscript');
    }
  },
};

export { FILE_BASE_URL };