import axios, { AxiosRequestConfig } from "axios"; // Added AxiosRequestConfig
import { Manuscript } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const manuscriptAPI = axios.create({
    baseURL: `${API_URL}/api/manuscripts`,
});

// Attach JWT token to every request
manuscriptAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Safe interceptor: don’t auto logout users
manuscriptAPI.interceptors.response.use(
    (res) => res,
    (err) => {
        return Promise.reject(err);
    }
);

// Define a type for the response of file operations
interface UploadResponse {
    success: boolean;
    data: Manuscript;
}

export const manuscriptService = {
    getPublicManuscripts: async (): Promise<Manuscript[]> => {
        try {
            const res = await manuscriptAPI.get<Manuscript[]>("/public");
            return res.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || error.message || "Failed to fetch public manuscripts");
        }
    },

    getResearcherManuscripts: async (): Promise<Manuscript[]> => {
        try {
            const res = await manuscriptAPI.get<Manuscript[]>("/researcher");
            return res.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || error.message || "Failed to fetch researcher manuscripts");
        }
    },

    getAllManuscripts: async (): Promise<Manuscript[]> => {
        try {
            const res = await manuscriptAPI.get<Manuscript[]>("/admin");
            return res.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || error.message || "Failed to fetch all manuscripts");
        }
    },

    getManuscriptById: async (id: string): Promise<Manuscript> => {
        try {
            const res = await manuscriptAPI.get<Manuscript>(`/${id}`);
            return res.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || error.message || "Failed to fetch manuscript");
        }
    },

    deleteManuscript: async (id: string): Promise<{ message: string }> => {
        try {
            const res = await manuscriptAPI.delete<{ message: string }>(`/${id}`);
            return res.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || error.message || "Failed to delete manuscript");
        }
    },

    // -----------------------------------------------------------------
    // NEW METHODS START HERE
    // -----------------------------------------------------------------

    updateManuscript: async (
        id: string,
        formData: FormData,
        onUploadProgress?: (progressEvent: any) => void
    ): Promise<Manuscript> => {
        const config: AxiosRequestConfig = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: onUploadProgress,
        };
        try {
            // PUT /:id
            const res = await manuscriptAPI.put<UploadResponse>(`/${id}`, formData, config);
            return res.data.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || error.message || "Failed to update manuscript");
        }
    },
};