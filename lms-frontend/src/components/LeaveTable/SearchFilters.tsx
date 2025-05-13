import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  automatedFilter: string;
  setAutomatedFilter: (value: string) => void;
  dateFilterFrom: Date | undefined;
  setDateFilterFrom: (date: Date | undefined) => void;
  dateFilterTo: Date | undefined;
  setDateFilterTo: (date: Date | undefined) => void;
  dateRangeOpen: boolean;
  setDateRangeOpen: (open: boolean) => void;
  dateFilterActive: boolean;
  dateFilterType: "start" | "end" | "range";
  setDateFilterType: (type: "start" | "end" | "range") => void;
  applyDateFilter: () => void;
  clearDateFilter: () => void;
  resetAllFilters: () => void;
  loadApplications: () => void;
  onRefresh: () => void;
}

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  automatedFilter,
  setAutomatedFilter,
  dateFilterFrom,
  setDateFilterFrom,
  dateFilterTo,
  setDateFilterTo,
  dateRangeOpen,
  setDateRangeOpen,
  dateFilterActive,
  dateFilterType,
  setDateFilterType,
  applyDateFilter,
  clearDateFilter,
  resetAllFilters,
  loadApplications,
  onRefresh,
}: SearchFiltersProps) {
  return (
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

        {/* Date Range Filter */}
        <Popover open={dateRangeOpen} onOpenChange={setDateRangeOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={dateFilterActive ? "default" : "outline"}
              className={cn(
                "w-full md:w-[210px] justify-start text-left font-normal",
                dateFilterActive && "bg-dhl-red hover:bg-dhl-red/90"
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilterActive ? (
                <span className="truncate">
                  {dateFilterType === "start" && dateFilterFrom
                    ? `Start: ${format(dateFilterFrom, "dd/MM/yyyy")}`
                    : dateFilterType === "end" && dateFilterTo
                    ? `End: ${format(dateFilterTo, "dd/MM/yyyy")}`
                    : dateFilterFrom && dateFilterTo
                    ? `${format(dateFilterFrom, "dd/MM/yyyy")} - ${format(
                        dateFilterTo,
                        "dd/MM/yyyy"
                      )}`
                    : "Date Filter"}
                </span>
              ) : (
                <span>Date Filter</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Card className="border-none shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Date Filter</CardTitle>
                <CardDescription>
                  Filter leave applications by date
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  {/* Filter type selection */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">Filter by:</span>
                    <div className="flex border rounded-md overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setDateFilterType("start")}
                        className={cn(
                          "text-xs px-2 py-1 transition-colors",
                          dateFilterType === "start"
                            ? "bg-dhl-red text-white"
                            : "bg-white hover:bg-gray-100"
                        )}>
                        Start Date
                      </button>
                      <button
                        type="button"
                        onClick={() => setDateFilterType("end")}
                        className={cn(
                          "text-xs px-2 py-1 transition-colors border-x",
                          dateFilterType === "end"
                            ? "bg-dhl-red text-white"
                            : "bg-white hover:bg-gray-100"
                        )}>
                        End Date
                      </button>
                      <button
                        type="button"
                        onClick={() => setDateFilterType("range")}
                        className={cn(
                          "text-xs px-2 py-1 transition-colors",
                          dateFilterType === "range"
                            ? "bg-dhl-red text-white"
                            : "bg-white hover:bg-gray-100"
                        )}>
                        Date Range
                      </button>
                    </div>
                  </div>

                  {/* Start date picker - always shown for Start Date or Range type */}
                  {(dateFilterType === "start" ||
                    dateFilterType === "range") && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm font-medium w-16">From:</span>
                      <div className="flex-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateFilterFrom && "text-muted-foreground"
                              )}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateFilterFrom ? (
                                format(dateFilterFrom, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateFilterFrom}
                              onSelect={setDateFilterFrom}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}

                  {/* End date picker - always shown for End Date or Range type */}
                  {(dateFilterType === "end" || dateFilterType === "range") && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm font-medium w-16">To:</span>
                      <div className="flex-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateFilterTo && "text-muted-foreground"
                              )}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateFilterTo ? (
                                format(dateFilterTo, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateFilterTo}
                              onSelect={setDateFilterTo}
                              initialFocus
                              disabled={(date) =>
                                dateFilterType === "range" && dateFilterFrom
                                  ? date < dateFilterFrom
                                  : false
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={clearDateFilter}>
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <Button onClick={applyDateFilter}>Apply Filter</Button>
              </CardFooter>
            </Card>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Refresh</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                loadApplications();
                onRefresh();
              }}>
              Refresh Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={resetAllFilters}>
              Clear All Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
