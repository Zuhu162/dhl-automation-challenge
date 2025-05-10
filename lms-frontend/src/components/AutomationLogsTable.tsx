import { format, parseISO, addHours } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";
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
  // Adjust UTC time to local time (adding 4 hours)
  const adjustTimeZone = (dateString: string): Date => {
    const date = parseISO(dateString);
    return addHours(date, 4);
  };

  // Format date with timezone adjustment
  const formatDate = (dateString: string): string => {
    return format(adjustTimeZone(dateString), "PPpp");
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

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Rows Processed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getPaginatedData().map((log) => (
            <TableRow key={log._id}>
              <TableCell>
                <div className="flex items-center">
                  {log.status === "true" ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <Badge
                    variant={log.status === "true" ? "outline" : "destructive"}>
                    {log.status === "true" ? "Success" : "Failed"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{formatDate(log.timeStart)}</TableCell>
              <TableCell>{formatDate(log.timeEnd)}</TableCell>
              <TableCell>
                {calculateDuration(log.timeStart, log.timeEnd)}
              </TableCell>
              <TableCell className="text-right">
                <span className="text-green-600 font-medium">
                  {log.successfulRows}
                </span>
                {" / "}
                <span className="text-red-600 font-medium">
                  {log.failedRows}
                </span>
              </TableCell>
            </TableRow>
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
