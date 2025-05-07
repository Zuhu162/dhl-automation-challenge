import { LeaveApplication, LeaveFormData } from "@/types";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with base URL and auth interceptor
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface LeaveResponse {
  success: boolean;
  count: number;
  data: LeaveApplication[];
}

export const leaveService = {
  getAll: async (): Promise<LeaveApplication[]> => {
    try {
      const response = await api.get<LeaveResponse>("/leaves");
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      console.warn("Unexpected API response structure:", response.data);
      return [];
    } catch (error) {
      console.error("Error fetching leaves:", error);
      throw error;
    }
  },

  getById: async (id: string): Promise<LeaveApplication> => {
    const response = await api.get(`/leaves/${id}`);
    return response.data;
  },

  create: async (leaveData: LeaveFormData): Promise<LeaveApplication> => {
    const response = await api.post("/leaves", leaveData);
    return response.data;
  },

  update: async (
    id: string,
    leaveData: Partial<LeaveFormData>
  ): Promise<LeaveApplication> => {
    const response = await api.put(`/leaves/${id}`, leaveData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/leaves/${id}`);
  },

  bulkCreate: async (
    leaveDataArray: LeaveFormData[]
  ): Promise<{
    success: LeaveApplication[];
    failures: { data: LeaveFormData; error: string }[];
  }> => {
    const response = await api.post("/leaves/bulk", leaveDataArray);
    return response.data;
  },
};
