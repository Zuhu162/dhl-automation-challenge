import { LeaveApplication, LeaveStatus } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronDown,
  ChevronUp,
  PencilIcon,
  Bot,
  UserRoundPen,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type SortField } from "./LeaveTable";

interface LeaveTableContentProps {
  isLoading: boolean;
  currentItems: LeaveApplication[];
  searchQuery: string;
  statusFilter: string;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  handleSort: (field: SortField) => void;
  handleEdit: (application: LeaveApplication) => void;
  handleDelete: (_id: string) => void;
  getStatusBadgeClass: (status: LeaveStatus) => string;
  rowsPerPage: number;
  activeTab: "active" | "completed";
}

export default function LeaveTableContent({
  isLoading,
  currentItems,
  searchQuery,
  statusFilter,
  sortField,
  sortDirection,
  handleSort,
  handleEdit,
  handleDelete,
  getStatusBadgeClass,
  rowsPerPage,
  activeTab,
}: LeaveTableContentProps) {
  // Format date function
  const formatDate = (dateString: string) => {
    try {
      // Try to parse the date string
      const date = parseISO(dateString);
      // Format to DD/MM/YYYY
      return format(date, "dd/MM/yyyy");
    } catch (error) {
      // Return the original string if parsing fails
      console.error("Date parsing error:", error);
      return dateString;
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;

    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 inline-block ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline-block ml-1" />
    );
  };

  // Loading skeleton row component
  const LoadingRow = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[150px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[40px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[40px]" />
      </TableCell>
    </TableRow>
  );

  // Render empty rows to maintain fixed height
  const renderEmptyRows = () => {
    if (currentItems.length >= rowsPerPage) return null;

    const emptyRowsCount = rowsPerPage - currentItems.length;
    return Array(emptyRowsCount)
      .fill(0)
      .map((_, index) => (
        <TableRow key={`empty-${index}`}>
          <TableCell colSpan={8} className="h-[52px]"></TableCell>
        </TableRow>
      ));
  };

  return (
    <div className="rounded-md border" style={{ minHeight: "440px" }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort("employeeId")}>
              Employee ID {renderSortIndicator("employeeId")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort("employeeName")}>
              Name {renderSortIndicator("employeeName")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort("leaveType")}>
              Leave Type {renderSortIndicator("leaveType")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort("startDate")}>
              Start Date {renderSortIndicator("startDate")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort("endDate")}>
              End Date {renderSortIndicator("endDate")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort("status")}>
              Status {renderSortIndicator("status")}
            </TableHead>
            <TableHead
              className="w-15 text-center cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort("isAutomated")}>
              Input By {renderSortIndicator("isAutomated")}
            </TableHead>
            <TableHead className="text-right">
              {activeTab === "completed" ? "Actions" : ""}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Loading skeletons
            Array(rowsPerPage)
              .fill(0)
              .map((_, i) => <LoadingRow key={i} />)
          ) : currentItems.length === 0 ? (
            <>
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  {searchQuery || statusFilter !== "all"
                    ? "No leave applications match your filters."
                    : activeTab === "active"
                    ? "No active leave applications found."
                    : "No completed leave applications found."}
                </TableCell>
              </TableRow>
              {renderEmptyRows()}
            </>
          ) : (
            // Actual data rows
            <>
              {currentItems.map((application) => (
                <TableRow key={application._id}>
                  <TableCell>{application.employeeId}</TableCell>
                  <TableCell>{application.employeeName}</TableCell>
                  <TableCell>{application.leaveType}</TableCell>
                  <TableCell>{formatDate(application.startDate)}</TableCell>
                  <TableCell>{formatDate(application.endDate)}</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(application.status)}>
                      {application.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {application.isAutomated ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <Bot className="h-4 w-4 text-dhl-red inline" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Input by automation script</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger>
                          <UserRoundPen className="h-4 w-4 text-gray-500 inline" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Manual input by user</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {activeTab === "active" ? <PencilIcon /> : "Actions"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEdit(application)}>
                          {activeTab === "active" ? "Edit" : "View"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(application._id)}
                          className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {renderEmptyRows()}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
