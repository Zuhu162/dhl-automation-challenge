import { useState, useEffect } from "react";
import { LeaveApplication, LeaveStatus } from "@/types";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { leaveService } from "@/services/leaveService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LeaveForm from "./LeaveForm";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format, parseISO, isBefore } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  PencilIcon,
  UserRoundPen,
} from "lucide-react";

// Define a type for the sort field
type SortField =
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

  // Sorting state - Updated to sort by startDate by default
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

  // Status badge styling
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

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;

    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 inline-block ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline-block ml-1" />
    );
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
      pages.push(totalPages);
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
    <TooltipProvider>
      <>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4 justify-between">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Search by employee ID or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={automatedFilter} onValueChange={setAutomatedFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by input type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Input Types</SelectItem>
                <SelectItem value="automated">Automated</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                loadApplications();
                onRefresh();
              }}
              variant="outline">
              Refresh
            </Button>
          </div>
        </div>

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

          <TabsContent value="active">
            <div className="rounded-md border" style={{ minHeight: "340px" }}>
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
                    <TableHead className="text-right"></TableHead>
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
                            : "No active leave applications found."}
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
                          <TableCell>
                            {formatDate(application.startDate)}
                          </TableCell>
                          <TableCell>
                            {formatDate(application.endDate)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={getStatusBadgeClass(
                                application.status
                              )}>
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
                                  <PencilIcon />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEdit(application)}>
                                  Edit
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
          </TabsContent>

          <TabsContent value="completed">
            <div className="rounded-md border" style={{ minHeight: "340px" }}>
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
                      className="w-10 cursor-pointer hover:bg-slate-50"
                      onClick={() => handleSort("isAutomated")}>
                      Input By {renderSortIndicator("isAutomated")}
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                          <TableCell>
                            {formatDate(application.startDate)}
                          </TableCell>
                          <TableCell>
                            {formatDate(application.endDate)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={getStatusBadgeClass(
                                application.status
                              )}>
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
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEdit(application)}>
                                  View
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
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {!isLoading && filteredApplications.length > 0 && (
          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      if (activeTab === "active" && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                      } else if (
                        activeTab === "completed" &&
                        completedPage > 1
                      ) {
                        setCompletedPage(completedPage - 1);
                      }
                    }}
                    className={
                      (activeTab === "active" && currentPage === 1) ||
                      (activeTab === "completed" && completedPage === 1)
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page, i) => (
                  <PaginationItem key={i}>
                    {page === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page as number)}
                        isActive={
                          activeTab === "active"
                            ? currentPage === page
                            : completedPage === page
                        }
                        className="cursor-pointer">
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (
                        activeTab === "active" &&
                        currentPage < activeTotalPages
                      ) {
                        setCurrentPage(currentPage + 1);
                      } else if (
                        activeTab === "completed" &&
                        completedPage < completedTotalPages
                      ) {
                        setCompletedPage(completedPage + 1);
                      }
                    }}
                    className={
                      (activeTab === "active" &&
                        currentPage === activeTotalPages) ||
                      (activeTab === "completed" &&
                        completedPage === completedTotalPages)
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
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
