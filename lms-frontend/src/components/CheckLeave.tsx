import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { LeaveApplication } from "@/types";

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

type CheckLeaveProps = {
  employeeId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDuplicateFound?: (isDuplicate: boolean) => void;
  onCheckingChange?: (isChecking: boolean) => void;
};

const CheckLeave = ({
  employeeId,
  startDate,
  endDate,
  onDuplicateFound,
  onCheckingChange,
}: CheckLeaveProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [existingLeave, setExistingLeave] = useState<LeaveApplication | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkForDuplicates = async () => {
      if (!employeeId || !startDate || !endDate) {
        setExistingLeave(null);
        setError(null);
        if (onDuplicateFound) onDuplicateFound(false);
        return;
      }

      setIsChecking(true);
      setError(null);

      try {
        // Format dates directly without timezone conversion
        const formatDate = (date: Date): string => {
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${year}-${month}-${day}`;
        };

        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        // Get all leaves and filter on the client side
        const response = await api.get("/leaves");
        const leaves = response.data.data;

        // Find any leave that matches the employee ID and has matching date parts (ignoring time)
        const duplicate = leaves.find((leave: LeaveApplication) => {
          if (leave.employeeId !== employeeId) return false;

          // Normalize dates from API by extracting just the date part
          const apiStartDate = leave.startDate
            ? leave.startDate.split("T")[0]
            : "";
          const apiEndDate = leave.endDate ? leave.endDate.split("T")[0] : "";

          // Compare just the date parts
          return (
            apiStartDate === formattedStartDate &&
            apiEndDate === formattedEndDate
          );
        });

        setExistingLeave(duplicate || null);

        // Notify parent component about duplicate status
        if (onDuplicateFound) onDuplicateFound(!!duplicate);
      } catch (error) {
        console.error("Error checking for duplicate leave:", error);
        setError("Failed to check for duplicate leave applications.");
        if (onDuplicateFound) onDuplicateFound(false);
      } finally {
        setIsChecking(false);
        if (onCheckingChange) onCheckingChange(false);
      }
    };

    // Only run the check when we have all required fields
    if (employeeId && startDate && endDate) {
      checkForDuplicates();
    } else {
      // Reset when fields are cleared
      setIsChecking(false);
      if (onCheckingChange) onCheckingChange(false);
      if (onDuplicateFound) onDuplicateFound(false);
    }
  }, [employeeId, startDate, endDate, onDuplicateFound, onCheckingChange]);

  if (isChecking) {
    return (
      <div className="mt-4">
        <div className="h-10 flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dhl-red"></div>
          <span className="ml-2">Checking for duplicate entries...</span>
        </div>
      </div>
    );
  }

  if (!employeeId || !startDate || !endDate) {
    return null;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (existingLeave) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Duplicate Leave Application</AlertTitle>
        <AlertDescription>
          A leave application already exists for {existingLeave.employeeName}{" "}
          (ID: {existingLeave.employeeId}) from{" "}
          {existingLeave.startDate?.split("T")[0] || existingLeave.startDate} to{" "}
          {existingLeave.endDate?.split("T")[0] || existingLeave.endDate} with
          status: {existingLeave.status}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert id="NoDuplicate" className="mt-4 bg-green-50 border-green-200">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertTitle id="NoDuplicateFoundTitle" className="text-green-800">
        No Duplicate Found
      </AlertTitle>
      <AlertDescription id="NoDuplicateFoundText" className="text-green-700">
        No existing leave application found with these details. You can proceed
        with submission.
      </AlertDescription>
    </Alert>
  );
};

export default CheckLeave;
