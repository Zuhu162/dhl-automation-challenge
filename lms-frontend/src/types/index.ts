export type LeaveType = "Annual" | "Medical" | "Emergency" | "Other";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveApplication {
  _id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LeaveFormData {
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
}
