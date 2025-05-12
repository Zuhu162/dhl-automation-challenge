export type LeaveType = "Annual" | "Medical" | "Emergency" | "Other";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

// Complete leave application record as stored in the database, including system-generated fields
export interface LeaveApplication {
  _id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  isAutomated: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Subset of fields needed for leave request form submission without system-generated fields
export interface LeaveFormData {
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  isAutomated?: boolean;
}
