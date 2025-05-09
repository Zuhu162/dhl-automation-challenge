import { useState, useEffect } from "react";
import { format, parseISO, addHours } from "date-fns";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
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
import {
  getAllAutomationLogs,
  type AutomationLog as AutomationLogType,
} from "@/services/automationLogService";

const AutomationLogs = () => {
  const [logs, setLogs] = useState<AutomationLogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Adjust UTC time to local time (adding 4 hours)
  const adjustTimeZone = (dateString: string): Date => {
    const date = parseISO(dateString);
    return addHours(date, 4);
  };

  // Format date with timezone adjustment
  const formatDate = (dateString: string): string => {
    return format(adjustTimeZone(dateString), "PPpp");
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await getAllAutomationLogs();
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setLogs(sortedData);
      setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
      setError(null);
    } catch (err) {
      console.error("Error loading automation logs:", err);
      setError("Failed to load automation logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleLogExpansion = (id: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLogs(newExpanded);
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Automation Logs</h1>
              <p className="text-gray-600">
                History of automation runs and their results
              </p>
            </div>
            <button
              onClick={loadLogs}
              className="mt-4 md:mt-0 flex items-center gap-1 px-4 py-2 bg-dhl-yellow hover:bg-yellow-500 text-black rounded">
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">Loading automation logs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-500">{error}</p>
              <button
                onClick={loadLogs}
                className="mt-4 px-4 py-2 bg-dhl-yellow hover:bg-yellow-500 text-black rounded">
                Try Again
              </button>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No automation logs found.</p>
            </div>
          ) : (
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
                    <TableRow
                      key={log._id}
                      className={expandedLogs.has(log._id) ? "bg-gray-50" : ""}>
                      <TableCell>
                        <div className="flex items-center">
                          {log.status === "true" ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mr-2" />
                          )}
                          <Badge
                            variant={
                              log.status === "true" ? "outline" : "destructive"
                            }>
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
                        onClick={handlePreviousPage}
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
                            onClick={() => setCurrentPage(Number(page))}
                            isActive={currentPage === page}
                            className="cursor-pointer">
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={handleNextPage}
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
          )}
        </main>
      </div>
    </>
  );
};

export default AutomationLogs;
