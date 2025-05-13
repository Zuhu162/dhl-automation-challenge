import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { LeaveApplication } from "@/types";

interface ActiveFiltersBannerProps {
  dateFilterType: "start" | "end" | "range";
  dateFilterFrom: Date | undefined;
  dateFilterTo: Date | undefined;
  activeTab: string;
  activeApplications: LeaveApplication[];
  completedApplications: LeaveApplication[];
  clearDateFilter: () => void;
}

export default function ActiveFiltersBanner({
  dateFilterType,
  dateFilterFrom,
  dateFilterTo,
  activeTab,
  activeApplications,
  completedApplications,
  clearDateFilter,
}: ActiveFiltersBannerProps) {
  return (
    <div className="bg-slate-50 p-3 mb-4 rounded-md flex flex-col sm:flex-row justify-between gap-2">
      <div className="flex items-center">
        <CalendarIcon className="h-4 w-4 mr-2 text-dhl-red" />
        <span className="text-sm">
          {dateFilterType === "start" && dateFilterFrom ? (
            <>
              Filtered by start date:{" "}
              <strong>{format(dateFilterFrom, "dd/MM/yyyy")}</strong>
            </>
          ) : dateFilterType === "end" && dateFilterTo ? (
            <>
              Filtered by end date:{" "}
              <strong>{format(dateFilterTo, "dd/MM/yyyy")}</strong>
            </>
          ) : dateFilterFrom && dateFilterTo ? (
            <>
              Filtered by date range:{" "}
              <strong>{format(dateFilterFrom, "dd/MM/yyyy")}</strong> to{" "}
              <strong>{format(dateFilterTo, "dd/MM/yyyy")}</strong>
            </>
          ) : (
            "Date filter active"
          )}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {activeTab === "active"
            ? activeApplications.length
            : completedApplications.length}{" "}
          results
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearDateFilter}
          className="h-8">
          <X className="h-4 w-4" />
          <span className="ml-1">Clear</span>
        </Button>
      </div>
    </div>
  );
}
