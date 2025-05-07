
import { LeaveApplication } from "@/types";

// Mock leave applications data
export const mockLeaveApplications: LeaveApplication[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "John Doe",
    leaveType: "Annual",
    startDate: "2024-05-10",
    endDate: "2024-05-15",
    status: "Approved",
    createdAt: "2024-05-01T10:30:00Z",
    updatedAt: "2024-05-02T14:20:00Z"
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Jane Smith",
    leaveType: "Sick",
    startDate: "2024-05-20",
    endDate: "2024-05-22",
    status: "Pending",
    createdAt: "2024-05-18T09:15:00Z",
    updatedAt: "2024-05-18T09:15:00Z"
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Robert Johnson",
    leaveType: "Emergency",
    startDate: "2024-05-05",
    endDate: "2024-05-07",
    status: "Rejected",
    createdAt: "2024-05-04T16:45:00Z",
    updatedAt: "2024-05-05T08:30:00Z"
  },
  {
    id: "4",
    employeeId: "EMP004",
    employeeName: "Sarah Williams",
    leaveType: "Annual",
    startDate: "2024-05-25",
    endDate: "2024-06-05",
    status: "Pending",
    createdAt: "2024-05-15T11:20:00Z",
    updatedAt: "2024-05-15T11:20:00Z"
  },
  {
    id: "5",
    employeeId: "EMP005",
    employeeName: "Michael Brown",
    leaveType: "Sick",
    startDate: "2024-05-03",
    endDate: "2024-05-04",
    status: "Approved",
    createdAt: "2024-05-01T08:30:00Z",
    updatedAt: "2024-05-01T14:15:00Z"
  },
  {
    id: "6",
    employeeId: "EMP006",
    employeeName: "Emily Davis",
    leaveType: "Other",
    startDate: "2024-05-30",
    endDate: "2024-06-02",
    status: "Pending",
    createdAt: "2024-05-20T09:45:00Z",
    updatedAt: "2024-05-20T09:45:00Z"
  },
  {
    id: "7",
    employeeId: "EMP007",
    employeeName: "David Wilson",
    leaveType: "Annual",
    startDate: "2024-06-10",
    endDate: "2024-06-20",
    status: "Approved",
    createdAt: "2024-05-25T14:30:00Z",
    updatedAt: "2024-05-26T10:15:00Z"
  },
  {
    id: "8",
    employeeId: "EMP008",
    employeeName: "Lisa Taylor",
    leaveType: "Emergency",
    startDate: "2024-05-07",
    endDate: "2024-05-09",
    status: "Approved",
    createdAt: "2024-05-06T17:20:00Z",
    updatedAt: "2024-05-06T18:30:00Z"
  },
  {
    id: "9",
    employeeId: "EMP009",
    employeeName: "James Anderson",
    leaveType: "Annual",
    startDate: "2024-05-18",
    endDate: "2024-05-28",
    status: "Approved",
    createdAt: "2024-05-10T10:15:00Z",
    updatedAt: "2024-05-11T09:30:00Z"
  },
  {
    id: "10",
    employeeId: "EMP010",
    employeeName: "Patricia Martinez",
    leaveType: "Sick",
    startDate: "2024-06-05",
    endDate: "2024-06-07",
    status: "Pending",
    createdAt: "2024-05-28T14:20:00Z",
    updatedAt: "2024-05-28T14:20:00Z"
  }
];

// Mock logs data
export const mockUploadLogs = [
  {
    id: "log1",
    timestamp: "2024-05-02T14:30:00Z",
    status: "success" as const,
    message: "Excel file processed successfully",
    details: "All 8 records were processed and updated in the system.",
    executionTime: "3.2s",
    fileName: "leave_data_may.xlsx",
    fileSize: 25600
  },
  {
    id: "log2",
    timestamp: "2024-04-28T10:15:00Z",
    status: "error" as const,
    message: "Failed to process Excel file",
    details: "Error in row 3: Missing required field 'employeeId'",
    executionTime: "1.5s",
    fileName: "leave_updates.xlsx",
    fileSize: 18432,
    error: "ValidationError: Missing required field 'employeeId' in row 3"
  },
  {
    id: "log3",
    timestamp: "2024-04-15T09:20:00Z",
    status: "success" as const,
    message: "Excel file processed successfully",
    details: "All 5 records were processed and updated in the system.",
    executionTime: "2.8s",
    fileName: "april_leaves.xlsx",
    fileSize: 21504
  },
  {
    id: "log4",
    timestamp: "2024-04-10T16:45:00Z",
    status: "error" as const,
    message: "Failed to process Excel file",
    details: "Invalid date format in row 7. Expected format: YYYY-MM-DD",
    executionTime: "2.1s",
    fileName: "leave_corrections.xlsx",
    fileSize: 16384,
    error: "ValidationError: Invalid date format in row 7"
  },
  {
    id: "log5",
    timestamp: "2024-03-28T11:30:00Z",
    status: "success" as const,
    message: "Excel file processed successfully",
    details: "All 12 records were processed and updated in the system.",
    executionTime: "4.5s",
    fileName: "march_summary.xlsx",
    fileSize: 32768
  },
  {
    id: "log6",
    timestamp: "2024-05-03T09:15:00Z",
    status: "success" as const,
    message: "Excel file processed successfully",
    details: "All 10 records were processed and updated in the system.",
    executionTime: "3.8s",
    fileName: "may_leave_updates.xlsx",
    fileSize: 28672
  },
  {
    id: "log7",
    timestamp: "2024-04-22T15:40:00Z",
    status: "error" as const,
    message: "Failed to process Excel file",
    details: "Invalid leave type in row 5. Expected one of: Annual, Sick, Emergency, Other",
    executionTime: "1.9s",
    fileName: "april_corrections.xlsx",
    fileSize: 17920,
    error: "ValidationError: Invalid leave type in row 5"
  }
];

// Helper function to get current people on leave
export const getCurrentPeopleOnLeave = () => {
  const today = new Date();
  return mockLeaveApplications.filter(leave => 
    leave.status === "Approved" && 
    new Date(leave.startDate) <= today && 
    new Date(leave.endDate) >= today
  );
};

// Helper function to get upcoming leaves
export const getUpcomingLeaves = () => {
  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(today.getDate() + 14);
  
  return mockLeaveApplications.filter(leave => 
    leave.status === "Approved" && 
    new Date(leave.startDate) > today &&
    new Date(leave.startDate) <= twoWeeksLater
  );
};

// Helper function to get people returning from leave
export const getPeopleReturningFromLeave = () => {
  const today = new Date();
  const oneWeekLater = new Date();
  oneWeekLater.setDate(today.getDate() + 7);
  
  return mockLeaveApplications.filter(leave => 
    leave.status === "Approved" && 
    new Date(leave.endDate) >= today &&
    new Date(leave.endDate) <= oneWeekLater
  );
};

// Analytics data for charts
export const getAnalyticsData = () => {
  const statusCounts = {
    Approved: mockLeaveApplications.filter(leave => leave.status === "Approved").length,
    Pending: mockLeaveApplications.filter(leave => leave.status === "Pending").length,
    Rejected: mockLeaveApplications.filter(leave => leave.status === "Rejected").length
  };
  
  // Get counts by leave type
  const leaveTypeCounts = mockLeaveApplications.reduce((acc, leave) => {
    acc[leave.leaveType] = (acc[leave.leaveType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Get monthly distribution
  const monthlyLeaves = mockLeaveApplications.reduce((acc, leave) => {
    const month = new Date(leave.startDate).getMonth();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[month];
    acc[monthName] = (acc[monthName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    statusCounts,
    leaveTypeCounts,
    monthlyLeaves,
    currentOnLeave: getCurrentPeopleOnLeave().length,
    upcomingLeaves: getUpcomingLeaves(),
    returningEmployees: getPeopleReturningFromLeave()
  };
};
