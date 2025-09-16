import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const manuscriptAPI = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
manuscriptAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Manuscript {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  description: string;
  thumbnail: string;
  images: string[];
  language: string;
  status: 'published' | 'pending' | 'draft';
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
  annotations?: Annotation[];
}

export interface Annotation {
  id: string;
  manuscriptId: string;
  userId: string;
  userName: string;
  text: string;
  pageNumber: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  createdAt: string;
}

export interface ManuscriptFilters {
  category?: string;
  language?: string;
  author?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ManuscriptService {
  async getManuscripts(
    filters?: ManuscriptFilters,
    page = 1,
    limit = 12
  ): Promise<PaginatedResponse<Manuscript>> {
    try {
      const params = {
        page,
        limit,
        ...filters,
      };
      const response = await manuscriptAPI.get('/manuscripts', { params });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch manuscripts');
    }
  }

  async getManuscriptById(id: string): Promise<Manuscript> {
    try {
      const response = await manuscriptAPI.get(`/manuscripts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch manuscript');
    }
  }

  async getFeaturedManuscripts(): Promise<Manuscript[]> {
    try {
      const response = await manuscriptAPI.get('/manuscripts/featured');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch featured manuscripts');
    }
  }

  async searchManuscripts(query: string): Promise<Manuscript[]> {
    try {
      const response = await manuscriptAPI.get('/manuscripts/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to search manuscripts');
    }
  }

  async createManuscript(manuscript: Omit<Manuscript, 'id' | 'createdAt' | 'updatedAt'>): Promise<Manuscript> {
    try {
      const response = await manuscriptAPI.post('/manuscripts', manuscript);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create manuscript');
    }
  }

  async updateManuscript(id: string, manuscript: Partial<Manuscript>): Promise<Manuscript> {
    try {
      const response = await manuscriptAPI.patch(`/manuscripts/${id}`, manuscript);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update manuscript');
    }
  }

  async deleteManuscript(id: string): Promise<void> {
    try {
      await manuscriptAPI.delete(`/manuscripts/${id}`);
    } catch (error) {
      throw new Error('Failed to delete manuscript');
    }
  }

  async getManuscriptAnnotations(manuscriptId: string): Promise<Annotation[]> {
    try {
      const response = await manuscriptAPI.get(`/manuscripts/${manuscriptId}/annotations`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch annotations');
    }
  }

  async addAnnotation(annotation: Omit<Annotation, 'id' | 'createdAt'>): Promise<Annotation> {
    try {
      const response = await manuscriptAPI.post(
        `/manuscripts/${annotation.manuscriptId}/annotations`,
        annotation
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to add annotation');
    }
  }

  async updateAnnotation(id: string, annotation: Partial<Annotation>): Promise<Annotation> {
    try {
      const response = await manuscriptAPI.patch(`/annotations/${id}`, annotation);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update annotation');
    }
  }

  async deleteAnnotation(id: string): Promise<void> {
    try {
      await manuscriptAPI.delete(`/annotations/${id}`);
    } catch (error) {
      throw new Error('Failed to delete annotation');
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await manuscriptAPI.get('/manuscripts/categories');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch categories');
    }
  }

  async getLanguages(): Promise<string[]> {
    try {
      const response = await manuscriptAPI.get('/manuscripts/languages');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch languages');
    }
  }
}

export const manuscriptService = new ManuscriptService();