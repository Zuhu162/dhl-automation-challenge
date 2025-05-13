import { useState, useEffect } from "react";
import { LeaveApplication, LeaveStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { leaveService } from "@/services/leaveService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, parseISO, isBefore, isAfter } from "date-fns";
import LeaveForm from "@/components/LeaveForm";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent } from "@/components/ui/pagination";

// Import the subcomponents
import SearchFilters from "./SearchFilters";
import ActiveFiltersBanner from "./ActiveFiltersBanner";
import LeaveTableContent from "./LeaveTableContent";
import TablePagination from "./TablePagination";

// Type definition for the sort field
export type SortField =
  | "employeeId"
  | "employeeName"
  | "leaveType"
  | "startDate"
  | "endDate"
  | "status"
  | "isAutomated"
  | null;

interface LeaveTableProps {
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function LeaveTable({
  onRefresh,
  isLoading = false,
}: LeaveTableProps) {
  const { toast } = useToast();
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    LeaveApplication[]
  >([]);
  const [activeApplications, setActiveApplications] = useState<
    LeaveApplication[]
  >([]);
  const [completedApplications, setCompletedApplications] = useState<
    LeaveApplication[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [automatedFilter, setAutomatedFilter] = useState<string>("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentApplication, setCurrentApplication] =
    useState<LeaveApplication | null>(null);
  const [activeTab, setActiveTab] = useState("active");

  // Date range filter states
  const [dateFilterFrom, setDateFilterFrom] = useState<Date | undefined>(
    undefined
  );
  const [dateFilterTo, setDateFilterTo] = useState<Date | undefined>(undefined);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [dateFilterActive, setDateFilterActive] = useState(false);
  const [dateFilterType, setDateFilterType] = useState<
    "start" | "end" | "range"
  >("range");

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const applications = await leaveService.getAll();
      setApplications(applications);
      filterApplications(applications);
    } catch (error) {
      console.error("Error loading applications:", error);
      toast({
        title: "Error",
        description: "Failed to load leave applications.",
        variant: "destructive",
      });
      setApplications([]);
      setFilteredApplications([]);
      setActiveApplications([]);
      setCompletedApplications([]);
    }
  };

  useEffect(() => {
    filterApplications(applications);
  }, [
    searchQuery,
    statusFilter,
    automatedFilter,
    applications,
    activeTab,
    sortField,
    sortDirection,
    dateFilterFrom,
    dateFilterTo,
    dateFilterActive,
    dateFilterType,
  ]);

  const filterApplications = (apps = applications) => {
    // First, separate active vs completed applications
    const today = new Date();

    // Active applications: end date is in the future
    let active = apps.filter((app) => {
      const endDate = parseISO(app.endDate);
      return !isBefore(endDate, today);
    });

    // Completed applications: end date is in the past
    let completed = apps.filter((app) => {
      const endDate = parseISO(app.endDate);
      return isBefore(endDate, today);
    });

    // Apply search query filter to both sets
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      active = active.filter(
        (app) =>
          app.employeeId.toLowerCase().includes(query) ||
          app.employeeName.toLowerCase().includes(query)
      );

      completed = completed.filter(
        (app) =>
          app.employeeId.toLowerCase().includes(query) ||
          app.employeeName.toLowerCase().includes(query)
      );
    }

    // Apply status filter to both sets
    if (statusFilter !== "all") {
      active = active.filter((app) => app.status === statusFilter);
      completed = completed.filter((app) => app.status === statusFilter);
    }

    // Apply automated filter to both sets
    if (automatedFilter !== "all") {
      const isAutomated = automatedFilter === "automated";
      active = active.filter((app) => app.isAutomated === isAutomated);
      completed = completed.filter((app) => app.isAutomated === isAutomated);
    }

    // Apply date range filter if active
    if (dateFilterActive) {
      // For start date filtering
      if (dateFilterType === "start" && dateFilterFrom) {
        const fromDate = new Date(dateFilterFrom);
        fromDate.setHours(0, 0, 0, 0);

        active = active.filter((app) => {
          const appStartDate = parseISO(app.startDate);
          // Find applications starting on the selected date
          const startDay = appStartDate.getDate();
          const startMonth = appStartDate.getMonth();
          const startYear = appStartDate.getFullYear();
          const filterDay = fromDate.getDate();
          const filterMonth = fromDate.getMonth();
          const filterYear = fromDate.getFullYear();

          return (
            startDay === filterDay &&
            startMonth === filterMonth &&
            startYear === filterYear
          );
        });

        completed = completed.filter((app) => {
          const appStartDate = parseISO(app.startDate);
          // Find applications starting on the selected date
          const startDay = appStartDate.getDate();
          const startMonth = appStartDate.getMonth();
          const startYear = appStartDate.getFullYear();
          const filterDay = fromDate.getDate();
          const filterMonth = fromDate.getMonth();
          const filterYear = fromDate.getFullYear();

          return (
            startDay === filterDay &&
            startMonth === filterMonth &&
            startYear === filterYear
          );
        });
      }

      // For end date filtering
      else if (dateFilterType === "end" && dateFilterTo) {
        const toDate = new Date(dateFilterTo);
        toDate.setHours(0, 0, 0, 0);

        active = active.filter((app) => {
          const appEndDate = parseISO(app.endDate);
          // Find applications ending on the selected date
          const endDay = appEndDate.getDate();
          const endMonth = appEndDate.getMonth();
          const endYear = appEndDate.getFullYear();
          const filterDay = toDate.getDate();
          const filterMonth = toDate.getMonth();
          const filterYear = toDate.getFullYear();

          return (
            endDay === filterDay &&
            endMonth === filterMonth &&
            endYear === filterYear
          );
        });

        completed = completed.filter((app) => {
          const appEndDate = parseISO(app.endDate);
          // Find applications ending on the selected date
          const endDay = appEndDate.getDate();
          const endMonth = appEndDate.getMonth();
          const endYear = appEndDate.getFullYear();
          const filterDay = toDate.getDate();
          const filterMonth = toDate.getMonth();
          const filterYear = toDate.getFullYear();

          return (
            endDay === filterDay &&
            endMonth === filterMonth &&
            endYear === filterYear
          );
        });
      }

      // For date range filtering (original behavior)
      else if (dateFilterType === "range" && dateFilterFrom && dateFilterTo) {
        // Set time to start of day for from date and end of day for to date
        const fromDate = new Date(dateFilterFrom);
        fromDate.setHours(0, 0, 0, 0);

        const toDate = new Date(dateFilterTo);
        toDate.setHours(23, 59, 59, 999);

        active = active.filter((app) => {
          const appStartDate = parseISO(app.startDate);
          const appEndDate = parseISO(app.endDate);

          // Include if leave period overlaps with filter range
          return (
            // Leave starts within filter range
            ((isAfter(appStartDate, fromDate) ||
              appStartDate.getTime() === fromDate.getTime()) &&
              (isBefore(appStartDate, toDate) ||
                appStartDate.getTime() === toDate.getTime())) ||
            // Leave ends within filter range
            ((isAfter(appEndDate, fromDate) ||
              appEndDate.getTime() === fromDate.getTime()) &&
              (isBefore(appEndDate, toDate) ||
                appEndDate.getTime() === toDate.getTime())) ||
            // Leave completely spans the filter range
            (isBefore(appStartDate, fromDate) && isAfter(appEndDate, toDate))
          );
        });

        completed = completed.filter((app) => {
          const appStartDate = parseISO(app.startDate);
          const appEndDate = parseISO(app.endDate);

          // Include if leave period overlaps with filter range
          return (
            // Leave starts within filter range
            ((isAfter(appStartDate, fromDate) ||
              appStartDate.getTime() === fromDate.getTime()) &&
              (isBefore(appStartDate, toDate) ||
                appStartDate.getTime() === toDate.getTime())) ||
            // Leave ends within filter range
            ((isAfter(appEndDate, fromDate) ||
              appEndDate.getTime() === fromDate.getTime()) &&
              (isBefore(appEndDate, toDate) ||
                appEndDate.getTime() === toDate.getTime())) ||
            // Leave completely spans the filter range
            (isBefore(appStartDate, fromDate) && isAfter(appEndDate, toDate))
          );
        });
      }
    }

    // Apply sorting if a sort field is selected
    if (sortField) {
      const sortFn = (a: LeaveApplication, b: LeaveApplication) => {
        let valueA, valueB;

        // Handle date fields differently
        if (sortField === "startDate" || sortField === "endDate") {
          valueA = new Date(a[sortField]).getTime();
          valueB = new Date(b[sortField]).getTime();
        }
        // Handle boolean fields differently
        else if (sortField === "isAutomated") {
          valueA = a[sortField] ? 1 : 0;
          valueB = b[sortField] ? 1 : 0;
        } else {
          valueA = a[sortField].toLowerCase();
          valueB = b[sortField].toLowerCase();
        }

        if (sortDirection === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      };

      active.sort(sortFn);
      completed.sort(sortFn);
    }

    setActiveApplications(active);
    setCompletedApplications(completed);
    setFilteredApplications(activeTab === "active" ? active : completed);

    // Reset to first page when filters change
    setCurrentPage(1);
    setCompletedPage(1);
  };

  const handleEdit = (application: LeaveApplication) => {
    setCurrentApplication(application);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (_id: string) => {
    try {
      await leaveService.delete(_id);
      await loadApplications();
      onRefresh();
      toast({
        title: "Leave application deleted",
        description: "The leave application has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the leave application.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSuccess = () => {
    setIsEditDialogOpen(false);
    loadApplications();
    onRefresh();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFilteredApplications(
      value === "active" ? activeApplications : completedApplications
    );
  };

  // Function to clear date range filters
  const clearDateFilter = () => {
    setDateFilterFrom(undefined);
    setDateFilterTo(undefined);
    setDateFilterActive(false);
    setDateFilterType("range");
  };

  // Function to validate date range
  const validateDateRange = (): boolean => {
    // Check based on filter type
    switch (dateFilterType) {
      case "start":
        if (!dateFilterFrom) {
          toast({
            title: "Invalid date",
            description: "Please select a start date.",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case "end":
        if (!dateFilterTo) {
          toast({
            title: "Invalid date",
            description: "Please select an end date.",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case "range":
        // Check if both dates are selected
        if (!dateFilterFrom || !dateFilterTo) {
          toast({
            title: "Invalid date range",
            description: "Please select both start and end dates.",
            variant: "destructive",
          });
          return false;
        }

        // Check if start date is before end date
        if (isAfter(dateFilterFrom, dateFilterTo)) {
          toast({
            title: "Invalid date range",
            description: "Start date must be before end date.",
            variant: "destructive",
          });
          return false;
        }
        return true;
    }
  };

  // Function to apply date filter
  const applyDateFilter = () => {
    if (validateDateRange()) {
      setDateFilterActive(true);
      setDateRangeOpen(false);
    }
  };

  // Function to reset all filters
  const resetAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setAutomatedFilter("all");
    clearDateFilter();
    loadApplications();
    onRefresh();
  };

  // Status badge styling (can be moved to utils but kept for simplicity)
  const getStatusBadgeClass = (status: LeaveStatus): string => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium";
      case "Rejected":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  // Handle sorting toggle when a column header is clicked
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Pagination calculations for active and completed tabs
  const activeTotalPages = Math.ceil(activeApplications.length / rowsPerPage);
  const completedTotalPages = Math.ceil(
    completedApplications.length / rowsPerPage
  );
  const totalPages =
    activeTab === "active" ? activeTotalPages : completedTotalPages;

  const startIndex =
    (activeTab === "active" ? currentPage - 1 : completedPage - 1) *
    rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentItems = filteredApplications.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    const currentPageValue =
      activeTab === "active" ? currentPage : completedPage;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate middle pages
      let startPage = Math.max(2, currentPageValue - 1);
      let endPage = Math.min(totalPages - 1, currentPageValue + 1);

      // Adjust if at the start
      if (currentPageValue <= 2) {
        endPage = 3;
      }
      // Adjust if at the end
      if (currentPageValue >= totalPages - 1) {
        startPage = totalPages - 2;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (activeTab === "active") {
      setCurrentPage(page);
    } else {
      setCompletedPage(page);
    }
  };

  return (
    <TooltipProvider>
      <>
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          automatedFilter={automatedFilter}
          setAutomatedFilter={setAutomatedFilter}
          dateFilterFrom={dateFilterFrom}
          setDateFilterFrom={setDateFilterFrom}
          dateFilterTo={dateFilterTo}
          setDateFilterTo={setDateFilterTo}
          dateRangeOpen={dateRangeOpen}
          setDateRangeOpen={setDateRangeOpen}
          dateFilterActive={dateFilterActive}
          dateFilterType={dateFilterType}
          setDateFilterType={setDateFilterType}
          applyDateFilter={applyDateFilter}
          clearDateFilter={clearDateFilter}
          resetAllFilters={resetAllFilters}
          loadApplications={loadApplications}
          onRefresh={onRefresh}
        />

        <Tabs
          defaultValue="active"
          className="w-full"
          value={activeTab}
          onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="active" className="px-6">
              Active Requests ({activeApplications.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="px-6">
              Completed Leaves ({completedApplications.length})
            </TabsTrigger>
          </TabsList>

          {/* Show active filters banner */}
          {dateFilterActive && (
            <ActiveFiltersBanner
              dateFilterType={dateFilterType}
              dateFilterFrom={dateFilterFrom}
              dateFilterTo={dateFilterTo}
              activeTab={activeTab}
              activeApplications={activeApplications}
              completedApplications={completedApplications}
              clearDateFilter={clearDateFilter}
            />
          )}

          <TabsContent value="active">
            <LeaveTableContent
              isLoading={isLoading}
              currentItems={currentItems}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              getStatusBadgeClass={getStatusBadgeClass}
              rowsPerPage={rowsPerPage}
              activeTab="active"
            />
          </TabsContent>

          <TabsContent value="completed">
            <LeaveTableContent
              isLoading={isLoading}
              currentItems={currentItems}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              getStatusBadgeClass={getStatusBadgeClass}
              rowsPerPage={rowsPerPage}
              activeTab="completed"
            />
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {!isLoading && filteredApplications.length > 0 && (
          <TablePagination
            activeTab={activeTab}
            currentPage={currentPage}
            completedPage={completedPage}
            activeTotalPages={activeTotalPages}
            completedTotalPages={completedTotalPages}
            handlePageChange={handlePageChange}
            pageNumbers={getPageNumbers()}
          />
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {activeTab === "active"
                  ? "Edit Leave Application"
                  : "View Leave Application"}
              </DialogTitle>
              <DialogDescription>
                {activeTab === "active"
                  ? "Update the leave application details below."
                  : "View the leave application details below."}
              </DialogDescription>
            </DialogHeader>
            {currentApplication && (
              <LeaveForm
                application={currentApplication}
                onSuccess={handleUpdateSuccess}
                readOnly={activeTab === "completed"}
              />
            )}
          </DialogContent>
        </Dialog>
      </>
    </TooltipProvider>
  );
}
