import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface AutomationResponse {
  success: boolean;
  message: string;
  output?: string;
  error?: string;
}

// Function to trigger UiPath automation
export const triggerUiPathAutomation =
  async (): Promise<AutomationResponse> => {
    try {
      const response = await axios.post<AutomationResponse>(
        `${API_URL}/automation/trigger`
      );
      return response.data;
    } catch (error) {
      console.error("Error triggering UiPath automation:", error);
      if (axios.isAxiosError(error) && error.response) {
        // Return the error from the API
        return error.response.data as AutomationResponse;
      }
      // Generic error
      return {
        success: false,
        message: "Failed to trigger automation. Please try again.",
      };
    }
  };

// Helper function to display toast messages for automation status
export const runAutomation = async () => {
  try {
    toast.info("Starting UiPath automation...");

    const result = await triggerUiPathAutomation();

    if (result.success) {
      toast.success(result.message || "Automation completed successfully");
      return true;
    } else {
      toast.error(result.message || "Automation failed to execute");
      return false;
    }
  } catch (error) {
    console.error("Error in automation:", error);
    toast.error("An unexpected error occurred while running the automation");
    return false;
  }
};
