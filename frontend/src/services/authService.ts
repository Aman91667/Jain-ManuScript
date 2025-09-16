import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const authAPI = axios.create({
  baseURL: API_BASE_URL,
});

authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupResearcherCredentials {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  researchDescription: string;
  idProofFile: File | null;
}

export interface SignupNormalCredentials {
  name: string;
  email: string;
  password: string;
}

export interface UpgradeCredentials {
  phoneNumber: string;
  researchDescription: string;
  idProofFile: File | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'researcher' | 'admin';
  isApproved: boolean;
  approvedManuscripts: string[];
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await authAPI.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      // ✅ FIX: More robust error handling
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    }
  }

  async signupNormal(credentials: SignupNormalCredentials): Promise<AuthResponse> {
    try {
      const response = await authAPI.post('/auth/signup/user', credentials);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Standard signup failed.';
      throw new Error(errorMessage);
    }
  }

  async signupResearcher(credentials: SignupResearcherCredentials): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      formData.append('name', credentials.name);
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);
      formData.append('phoneNumber', credentials.phoneNumber);
      formData.append('researchDescription', credentials.researchDescription);
      if (credentials.idProofFile) {
        formData.append('idProofFile', credentials.idProofFile);
      }

      const response = await authAPI.post('/auth/signup/researcher', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Researcher application failed.';
      throw new Error(errorMessage);
    }
  }

  async applyForResearcherStatus(credentials: UpgradeCredentials): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      formData.append('phoneNumber', credentials.phoneNumber);
      formData.append('researchDescription', credentials.researchDescription);
      if (credentials.idProofFile) {
        formData.append('idProofFile', credentials.idProofFile);
      }

      const response = await authAPI.post('/users/apply-researcher', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit application.';
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await authAPI.get('/auth/me');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to get current user';
      throw new Error(errorMessage);
    }
  }
}

export const authService = new AuthService();