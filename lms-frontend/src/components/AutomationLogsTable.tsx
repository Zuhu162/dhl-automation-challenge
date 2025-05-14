import { parseISO, addHours, format } from "date-fns";
import {
  CheckCircle,
  XCircle,
  FileWarning,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { type AutomationLog } from "@/services/automationLogService";
import { useState } from "react";

interface AutomationLogsTableProps {
  logs: AutomationLog[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function AutomationLogsTable({
  logs,
  loading,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
}: AutomationLogsTableProps) {
  // State to track expanded rows
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Adjust UTC time to local time (adding 4 hours)
  const adjustTimeZone = (dateString: string): Date => {
    const date = parseISO(dateString);
    return addHours(date, 4);
  };

  // Format date with timezone adjustment
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC", // Optional: remove if you want local timezone
    }).format(date);
  };

  // Calculate duration between start and end time
  const calculateDuration = (startTime: string, endTime: string): string => {
    const start = adjustTimeZone(startTime);
    const end = adjustTimeZone(endTime);
    const durationMs = end.getTime() - start.getTime();

    // Convert to minutes and seconds
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  };

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return logs.slice(startIndex, endIndex);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push("ellipsis1");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push("ellipsis2");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">Loading automation logs...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No automation logs found.</p>
      </div>
    );
  }

  // Function to get row background color based on status
  const getRowBgColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-50 hover:bg-green-100 transition-colors";
      case "partial":
        return "bg-yellow-50 hover:bg-yellow-100 transition-colors";
      case "failed":
        return "bg-red-50 hover:bg-red-100 transition-colors";
      default:
        return "";
    }
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Rows Processed</TableHead>
            <TableHead>Spreadsheet</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getPaginatedData().map((log) => (
            <>
              <TableRow
                key={log._id}
                className={`cursor-pointer ${getRowBgColor(log.status)}`}
                onClick={() => toggleRowExpansion(log._id)}>
                <TableCell className="px-2">
                  {expandedRows[log._id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {log.status === "complete" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : log.status === "partial" ? (
                      <FileWarning className="h-5 w-5 text-yellow-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <Badge
                      variant={
                        log.status === "complete"
                          ? "success"
                          : log.status === "partial"
                          ? "warning"
                          : "destructive"
                      }>
                      {log.status === "complete"
                        ? "Complete"
                        : log.status === "partial"
                        ? "Partial"
                        : "Failed"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{formatDate(log.timeStart)}</TableCell>
                <TableCell>{formatDate(log.timeEnd)}</TableCell>
                <TableCell>
                  {calculateDuration(log.timeStart, log.timeEnd)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  <span className="text-green-600">{log.successfulRows}</span>
                  {" / "}
                  <span className="text-red-600">{log.failedRows}</span>
                  {" / "}
                  <span>
                    {log.totalRows ||
                      (
                        parseInt(log.successfulRows) + parseInt(log.failedRows)
                      ).toString()}
                  </span>
                </TableCell>
                <TableCell>
                  {log.spreadsheetLink ? (
                    <a
                      href={log.spreadsheetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                      onClick={(e) => e.stopPropagation()}>
                      Link
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
              </TableRow>
              {expandedRows[log._id] && (
                <TableRow
                  className={`${getRowBgColor(log.status)} bg-opacity-50`}>
                  <TableCell colSpan={7} className="p-4">
                    <div className="text-sm">
                      <h4 className="font-semibold mb-2">Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p>
                            <span className="font-medium">Log ID:</span>{" "}
                            {log._id}
                          </p>
                          <p>
                            <span className="font-medium">Status:</span>{" "}
                            {log.status}
                          </p>
                          <p>
                            <span className="font-medium">Rows Processed:</span>{" "}
                            <span className="text-green-600">
                              {log.successfulRows}
                            </span>{" "}
                            valid,{" "}
                            <span className="text-red-600">
                              {log.failedRows}
                            </span>{" "}
                            invalid (Total:{" "}
                            {log.totalRows ||
                              (
                                parseInt(log.successfulRows) +
                                parseInt(log.failedRows)
                              ).toString()}
                            )
                          </p>
                          {log.remarks && (
                            <p>
                              <span className="font-medium">Remarks:</span>{" "}
                              <span className="text-gray-700">
                                {log.remarks}
                              </span>
                            </p>
                          )}
                        </div>
                        <div>
                          <p>
                            <span className="font-medium">Started:</span>{" "}
                            {formatDate(log.timeStart)}
                          </p>
                          <p>
                            <span className="font-medium">Ended:</span>{" "}
                            {formatDate(log.timeEnd)}
                          </p>
                          <p>
                            <span className="font-medium">Duration:</span>{" "}
                            {calculateDuration(log.timeStart, log.timeEnd)}
                          </p>
                          <p>
                            <span className="font-medium">Spreadsheet:</span>{" "}
                            {log.spreadsheetLink ? (
                              <a
                                href={log.spreadsheetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800">
                                Download
                              </a>
                            ) : (
                              <span className="text-gray-400">
                                Not available
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>
                          Created: {format(new Date(log.createdAt), "PPpp")}
                        </p>
                        <p>
                          Last Updated:{" "}
                          {format(new Date(log.updatedAt), "PPpp")}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) =>
              page === "ellipsis1" || page === "ellipsis2" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(Number(page))}
                    isActive={currentPage === page}
                    className="cursor-pointer">
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
