import axios from "axios";
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

// Handle unauthorized errors globally
manuscriptAPI.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      try { window.location.href = "/login"; } catch {}
    }
    return Promise.reject(err);
  }
);

export const manuscriptService = {
  getManuscripts: async (): Promise<Manuscript[]> => {
    try {
      const res = await manuscriptAPI.get<Manuscript[]>("/");
      return res.data.filter(m => m.isApproved ?? true);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message || "Failed to fetch manuscripts");
    }
  }
};

