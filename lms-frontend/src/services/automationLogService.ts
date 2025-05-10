import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface AutomationLog {
  _id: string;
  status: string;
  timeStart: string;
  timeEnd: string;
  successfulRows: string;
  failedRows: string;
  createdAt: string;
  updatedAt: string;
  spreadsheetLink?: string;
}

// Get all automation logs - no auth required
export const getAllAutomationLogs = async (): Promise<AutomationLog[]> => {
  try {
    const response = await axios.get(`${API_URL}/automation-logs`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching automation logs:", error);
    throw error;
  }
};

// Get a single automation log by ID - no auth required
export const getAutomationLogById = async (
  id: string
): Promise<AutomationLog> => {
  try {
    const response = await axios.get(`${API_URL}/automation-logs/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching automation log ${id}:`, error);
    throw error;
  }
};

// Create a new automation log - no auth required
export const createAutomationLog = async (
  logData: Omit<AutomationLog, "_id" | "createdAt" | "updatedAt">
): Promise<AutomationLog> => {
  try {
    const response = await axios.post(`${API_URL}/automation-logs`, logData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating automation log:", error);
    throw error;
  }
};

// Update an automation log - no auth required
export const updateAutomationLog = async (
  id: string,
  logData: Partial<Omit<AutomationLog, "_id" | "createdAt" | "updatedAt">>
): Promise<AutomationLog> => {
  try {
    const response = await axios.put(
      `${API_URL}/automation-logs/${id}`,
      logData
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error updating automation log ${id}:`, error);
    throw error;
  }
};

// Delete an automation log - no auth required
export const deleteAutomationLog = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/automation-logs/${id}`);
  } catch (error) {
    console.error(`Error deleting automation log ${id}:`, error);
    throw error;
  }
};
