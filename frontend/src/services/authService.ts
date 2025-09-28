// src/services/authService.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// --------------------
// Types
// --------------------
export interface User {
    _id: string; // backend me _id hai
    name: string;
    email: string;
    role: 'user' | 'researcher' | 'admin';
    isApproved: boolean;
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

// --------------------
// Axios instance
// --------------------
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// --------------------
// Auth Functions
// --------------------
export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const res = await api.post<AuthResponse>('/api/auth/login', credentials);
        return res.data;
    },

    signupNormal: async (credentials: SignupNormalCredentials): Promise<AuthResponse> => {
        const res = await api.post<AuthResponse>('/api/auth/signup/user', credentials);
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

        const res = await api.post<AuthResponse>('/api/auth/signup/researcher', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },

    applyForResearcherStatus: async (credentials: ApplyForResearcherCredentials): Promise<AuthResponse> => {
        const formData = new FormData();
        formData.append('phoneNumber', credentials.phoneNumber);
        formData.append('researchDescription', credentials.researchDescription);
        formData.append('idProofFile', credentials.idProofFile);

        const res = await api.post<AuthResponse>('/api/auth/apply-for-researcher', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const res = await api.get<User>('/api/auth/me');
        return res.data;
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    },

    // --------------------
    // Admin Functions
    // --------------------
    fetchPendingApplications: async (): Promise<User[]> => {
        const userData = localStorage.getItem('userData');
        if (!userData) throw new Error('Unauthorized');
        const user: User = JSON.parse(userData);
        if (user.role !== 'admin') throw new Error('Only admins can view pending applications');

        const res = await api.get<User[]>('/api/admin/researcher/requests');
        return res.data; // backend returns array directly
    },

    approveResearcher: async (researcherId: string): Promise<{ message: string }> => {
        const userData = localStorage.getItem('userData');
        if (!userData) throw new Error('Unauthorized');
        const user: User = JSON.parse(userData);
        if (user.role !== 'admin') throw new Error('Only admins can approve researchers');

        const res = await api.put<{ message: string }>(`/api/admin/researcher/approve/${researcherId}`, { isApproved: true });
        return res.data;
    },

    rejectResearcher: async (researcherId: string): Promise<{ message: string }> => {
        const userData = localStorage.getItem('userData');
        if (!userData) throw new Error('Unauthorized');
        const user: User = JSON.parse(userData);
        if (user.role !== 'admin') throw new Error('Only admins can reject researchers');

        const res = await api.put<{ message: string }>(`/api/admin/researcher/approve/${researcherId}`, { isApproved: false });
        return res.data;
    },
};
