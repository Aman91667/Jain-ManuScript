import { api } from '@/config/api';
import axios from 'axios';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'researcher' | 'admin';
  isApproved: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  phoneNumber?: string;
  researchDescription?: string;
  idProofUrl?: string;
}

export interface LoginCredentials { 
  email: string; 
  password: string; 
}

export interface SignupNormalCredentials { 
  name: string; 
  email: string; 
  password: string; 
}

export interface SignupResearcherCredentials {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  researchDescription: string;
  idProofFile: File;
  agreeToTerms: boolean;
}

export interface ApplyForResearcherCredentials {
  phoneNumber: string;
  researchDescription: string;
  idProofFile: File;
  agreeToTerms: boolean;
}

export interface AuthResponse { 
  user: User; 
  token: string; 
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('authToken', res.data.token);
    localStorage.setItem('userData', JSON.stringify(res.data.user));
    return res.data;
  },

  signupNormal: async (credentials: SignupNormalCredentials): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/signup/user', credentials);
    localStorage.setItem('authToken', res.data.token);
    localStorage.setItem('userData', JSON.stringify(res.data.user));
    return res.data;
  },

  signupResearcher: async (credentials: SignupResearcherCredentials): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('name', credentials.name);
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);
    formData.append('phoneNumber', credentials.phoneNumber);
    formData.append('researchDescription', credentials.researchDescription);
    formData.append('idProofFile', credentials.idProofFile);
    formData.append('agreeToTerms', credentials.agreeToTerms ? 'true' : 'false');

    const res = await api.post<AuthResponse>('/auth/signup/researcher', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    localStorage.setItem('authToken', res.data.token);
    localStorage.setItem('userData', JSON.stringify(res.data.user));
    return res.data;
  },

  applyForResearcherStatus: async (credentials: ApplyForResearcherCredentials): Promise<{ user: User; message: string }> => {
    const formData = new FormData();
    formData.append('phoneNumber', credentials.phoneNumber);
    formData.append('researchDescription', credentials.researchDescription);
    formData.append('idProofFile', credentials.idProofFile);
    formData.append('agreeToTerms', credentials.agreeToTerms ? 'true' : 'false');

    const res = await api.post<{ user: User; message: string }>(
      '/auth/apply-for-researcher',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    // Update the current user's local state since they initiated this change
    localStorage.setItem('userData', JSON.stringify(res.data.user));
    return res.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  },

  fetchPendingApplications: async (): Promise<User[]> => {
    // Assumes admin is logged in, server side handles access control
    const res = await api.get<User[]>('/admin/researcher/requests');
    return res.data;
  },

  approveResearcher: async (researcherId: string): Promise<{ message: string; user: User }> => {
    const res = await api.put<{ message: string; user: User }>(`/admin/researcher/approve/${researcherId}`);
    return res.data;
  },

  rejectResearcher: async (researcherId: string, rejectionReason: string): Promise<{ message: string; user?: User }> => {
    const res = await api.put(`/admin/researcher/reject/${researcherId}`, 
      { rejectionReason }, 
      { headers: { 'Content-Type': 'application/json' } }
    );

    // FIX: Removed the flawed local storage update logic. 
    // The rejected user will now correctly fetch their new status on the next load.

    return res.data;
  },
};
