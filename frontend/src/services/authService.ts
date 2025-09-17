// src/services/authService.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'researcher' | 'admin';
  isApproved: boolean;
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
}

export interface ApplyForResearcherCredentials {
  phoneNumber: string;
  researchDescription: string;
  idProofFile: File;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const api = axios.create({
  baseURL: `${API_URL}/api/auth`,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

const signupNormal = async (credentials: SignupNormalCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post('/signup/user', credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

const signupResearcher = async (credentials: SignupResearcherCredentials): Promise<AuthResponse> => {
  try {
    const formData = new FormData();
    formData.append('name', credentials.name);
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);
    formData.append('phoneNumber', credentials.phoneNumber);
    formData.append('researchDescription', credentials.researchDescription);
    formData.append('idProofFile', credentials.idProofFile);

    const response = await api.post('/signup/researcher', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Researcher signup failed');
  }
};

const applyForResearcherStatus = async (credentials: ApplyForResearcherCredentials) => {
  try {
    const formData = new FormData();
    formData.append('phoneNumber', credentials.phoneNumber);
    formData.append('researchDescription', credentials.researchDescription);
    formData.append('idProofFile', credentials.idProofFile);

    const response = await api.post('/apply-for-researcher', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Application failed');
  }
};

const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get('/me');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get current user');
  }
};

const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  delete axios.defaults.headers.common['Authorization'];
};

// ✅ NEW: Functions for Admin Dashboard
const fetchPendingApplications = async () => {
  try {
    const response = await api.get('/admin/researcher-applications');
    return response.data.applications;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch pending applications.');
  }
};

const approveResearcher = async (researcherId: string) => {
  try {
    const response = await api.patch(`/admin/approve/${researcherId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to approve researcher.');
  }
};

const rejectResearcher = async (researcherId: string) => {
  try {
    const response = await api.patch(`/admin/reject/${researcherId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to reject researcher.');
  }
};


export const authService = {
  login,
  signupNormal,
  signupResearcher,
  applyForResearcherStatus,
  getCurrentUser,
  logout,
  fetchPendingApplications, // ✅ Added to export
  approveResearcher, // ✅ Added to export
  rejectResearcher, // ✅ Added to export
};