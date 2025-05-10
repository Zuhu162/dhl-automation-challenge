import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { LeaveApplication } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

const MAX_VISIBLE_EMPLOYEES = 2;

interface LeaveCalendarProps {
  leaveData: LeaveApplication[] | undefined;
  isLoading: boolean;
}

const LeaveCalendar = ({ leaveData, isLoading }: LeaveCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogContent, setDialogContent] = useState<{
    day: string;
    leaving: LeaveApplication[];
    returning: LeaveApplication[];
  } | null>(null);

  // Go to previous month
  const prevMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  // Go to next month
  const nextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  // Go to current month
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get days in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // Get days from previous month to fill start of calendar
  const firstDayOfMonth = startOfMonth(currentDate).getDay();

  // Get employees leaving and returning in the current month
  const getLeavesForDay = (day: Date) => {
    if (!leaveData) return { leaving: [], returning: [] };

    const dayString = format(day, "yyyy-MM-dd");

    const leaving = leaveData.filter(
      (leave) => format(new Date(leave.startDate), "yyyy-MM-dd") === dayString
    );

    const returning = leaveData.filter(
      (leave) => format(new Date(leave.endDate), "yyyy-MM-dd") === dayString
    );

    return { leaving, returning };
  };

  // Count employees leaving and returning in the current month
  const getMonthSummary = () => {
    if (!leaveData) return { leaving: 0, returning: 0 };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    const leaving = leaveData.filter((leave) => {
      const startDate = new Date(leave.startDate);
      return startDate >= monthStart && startDate <= monthEnd;
    });

    const returning = leaveData.filter((leave) => {
      const endDate = new Date(leave.endDate);
      return endDate >= monthStart && endDate <= monthEnd;
    });

    return { leaving: leaving.length, returning: returning.length };
  };

  const handleDayClick = (day: Date) => {
    const { leaving, returning } = getLeavesForDay(day);

    // Only open dialog if there's data to show
    if (leaving.length > 0 || returning.length > 0) {
      setDialogContent({
        day: format(day, "EEEE, MMMM d, yyyy"),
        leaving,
        returning,
      });
    }
  };

  const closeDialog = () => {
    setDialogContent(null);
  };

  const monthSummary = getMonthSummary();

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Leave Calendar</h1>
            <p className="text-gray-600">{format(currentDate, "MMMM yyyy")}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="text-sm font-medium text-yellow-600">
                Employees Leaving
              </div>
              <div className="mt-1 flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    monthSummary.leaving
                  )}
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm font-medium text-blue-600">
                Employees Returning
              </div>
              <div className="mt-1 flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    monthSummary.returning
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Calendar header */}
        <div className="grid grid-cols-7 gap-px border-b">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="px-3 py-2 text-center text-sm font-semibold text-gray-900">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Empty cells for days from previous month */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div
              key={`empty-start-${index}`}
              className="bg-gray-50 px-3 py-2 h-32 md:h-40">
              <div className="text-gray-400 text-sm"></div>
            </div>
          ))}

          {/* Days of current month */}
          {daysInMonth.map((day) => {
            const { leaving, returning } = getLeavesForDay(day);
            const hasOverflow =
              leaving.length > MAX_VISIBLE_EMPLOYEES ||
              returning.length > MAX_VISIBLE_EMPLOYEES;

            return (
              <div
                key={day.toString()}
                onClick={() => handleDayClick(day)}
                className={`bg-white px-3 py-2 h-32 md:h-40 ${
                  isToday(day) ? "ring-2 ring-inset ring-dhl-red" : ""
                } ${
                  leaving.length > 0 || returning.length > 0
                    ? "cursor-pointer hover:bg-gray-50"
                    : ""
                }`}>
                <div
                  className={`text-sm ${
                    isToday(day)
                      ? "font-semibold text-dhl-red"
                      : "text-gray-900"
                  }`}>
                  {format(day, "d")}
                </div>

                <div className="mt-2 space-y-1 max-h-28 md:max-h-36 overflow-y-auto">
                  {leaving.length > 0 && (
                    <div className="bg-yellow-100 bg-opacity-70 rounded py-1 px-2">
                      <p className="text-xs font-medium text-yellow-800">
                        Leaving:
                      </p>
                      {leaving.slice(0, MAX_VISIBLE_EMPLOYEES).map((leave) => (
                        <p
                          key={leave._id}
                          className="text-xs text-yellow-700 truncate">
                          {leave.employeeName}
                        </p>
                      ))}
                      {leaving.length > MAX_VISIBLE_EMPLOYEES && (
                        <p className="text-xs text-yellow-800 font-medium mt-1">
                          +{leaving.length - MAX_VISIBLE_EMPLOYEES} more
                        </p>
                      )}
                    </div>
                  )}

                  {returning.length > 0 && (
                    <div className="bg-blue-100 bg-opacity-70 rounded py-1 px-2 mt-1">
                      <p className="text-xs font-medium text-blue-800">
                        Returning:
                      </p>
                      {returning
                        .slice(0, MAX_VISIBLE_EMPLOYEES)
                        .map((leave) => (
                          <p
                            key={leave._id}
                            className="text-xs text-blue-700 truncate">
                            {leave.employeeName}
                          </p>
                        ))}
                      {returning.length > MAX_VISIBLE_EMPLOYEES && (
                        <p className="text-xs text-blue-800 font-medium mt-1">
                          +{returning.length - MAX_VISIBLE_EMPLOYEES} more
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Empty cells for days from next month */}
          {Array.from({
            length: (7 - ((firstDayOfMonth + daysInMonth.length) % 7)) % 7,
          }).map((_, index) => (
            <div
              key={`empty-end-${index}`}
              className="bg-gray-50 px-3 py-2 h-32 md:h-40">
              <div className="text-gray-400 text-sm"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!dialogContent} onOpenChange={closeDialog}>
        {dialogContent && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Leave Details: {dialogContent.day}</DialogTitle>
              <DialogDescription>
                Employees leaving and returning on this day
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {dialogContent.leaving.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">
                    Employees Leaving ({dialogContent.leaving.length})
                  </h3>
                  <div className="max-h-40 overflow-y-auto">
                    {dialogContent.leaving.map((leave) => (
                      <div
                        key={leave._id}
                        className="py-1 border-b border-yellow-100 last:border-0">
                        <p className="text-sm font-medium">
                          {leave.employeeName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {leave.leaveType} Leave
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {dialogContent.returning.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">
                    Employees Returning ({dialogContent.returning.length})
                  </h3>
                  <div className="max-h-40 overflow-y-auto">
                    {dialogContent.returning.map((leave) => (
                      <div
                        key={leave._id}
                        className="py-1 border-b border-blue-100 last:border-0">
                        <p className="text-sm font-medium">
                          {leave.employeeName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {leave.leaveType} Leave
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogClose asChild>
              <Button className="mt-2">Close</Button>
            </DialogClose>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default LeaveCalendar;
