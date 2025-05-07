import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { leaveService } from "@/services/leaveService";
import { LeaveApplication } from "@/types";
import {
  format,
  addDays,
  isSameDay,
  isBefore,
  isAfter,
  parseISO,
} from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const EmployeeStatusTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingLeaves, setUpcomingLeaves] = useState<LeaveApplication[]>([]);
  const [returningEmployees, setReturningEmployees] = useState<
    LeaveApplication[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const applications = await leaveService.getAll();
        const today = new Date();
        const nextWeek = addDays(today, 7);

        // Filter for employees who will start leave in the next 7 days
        const upcoming = applications
          .filter((app) => {
            const startDate = parseISO(app.startDate);
            return (
              app.status === "Approved" &&
              isAfter(startDate, today) &&
              isBefore(startDate, nextWeek)
            );
          })
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );

        // Filter for employees who will return from leave in the next 7 days
        const returning = applications
          .filter((app) => {
            const endDate = parseISO(app.endDate);
            return (
              app.status === "Approved" &&
              isAfter(endDate, today) &&
              isBefore(endDate, nextWeek)
            );
          })
          .sort(
            (a, b) =>
              new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
          );

        setUpcomingLeaves(upcoming);
        setReturningEmployees(returning);
      } catch (error) {
        console.error("Error fetching employee status:", error);
        setUpcomingLeaves([]);
        setReturningEmployees([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const LoadingRow = () => (
    <tr className="border-b">
      <td className="py-2 px-3">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-3 w-[100px] mt-1" />
      </td>
      <td className="py-2 px-3">
        <Skeleton className="h-4 w-[100px]" />
      </td>
      <td className="py-2 px-3">
        <Skeleton className="h-4 w-[80px]" />
      </td>
    </tr>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming Leave</TabsTrigger>
            <TabsTrigger value="returning">Returning Soon</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {isLoading ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-2 px-3 text-left text-sm font-medium">
                        Employee
                      </th>
                      <th className="py-2 px-3 text-left text-sm font-medium">
                        Start Date
                      </th>
                      <th className="py-2 px-3 text-left text-sm font-medium">
                        Leave Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <LoadingRow />
                    <LoadingRow />
                    <LoadingRow />
                  </tbody>
                </table>
              </div>
            ) : upcomingLeaves.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-2 px-3 text-left text-sm font-medium">
                        Employee
                      </th>
                      <th className="py-2 px-3 text-left text-sm font-medium">
                        Start Date
                      </th>
                      <th className="py-2 px-3 text-left text-sm font-medium">
                        Leave Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingLeaves.map((leave) => (
                      <tr key={leave._id} className="border-b">
                        <td className="py-2 px-3">
                          <div className="font-medium">
                            {leave.employeeName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {leave.employeeId}
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          {format(new Date(leave.startDate), "PP")}
                        </td>
                        <td className="py-2 px-3">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {leave.leaveType}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">
                No upcoming leaves scheduled
              </p>
            )}
          </TabsContent>

          <TabsContent value="returning">
            {isLoading ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-2 px-3 text-left text-sm font-medium">
                        Employee
                      </th>
                      <th className="py-2 px-3 text-left text-sm font-medium">
                        Return Date
                      </th>
                      <th className="py-2 px-3 text-left text-sm font-medium">
                        Leave Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <LoadingRow />
                    <LoadingRow />
                    <LoadingRow />
                  </tbody>
                </table>
              </div>
            ) : returningEmployees.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-2 px-3 text-left text-sm font-medium">
                        Employee
                      </th>
                      <th className="py-2 px-3 text-left text-sm font-medium">
                        Return Date
                      </th>
                      <th className="py-2 px-3 text-left text-sm font-medium">
                        Leave Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {returningEmployees.map((leave) => (
                      <tr key={leave._id} className="border-b">
                        <td className="py-2 px-3">
                          <div className="font-medium">
                            {leave.employeeName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {leave.employeeId}
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          {format(new Date(leave.endDate), "PP")}
                        </td>
                        <td className="py-2 px-3">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {leave.leaveType}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">
                No employees returning soon
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmployeeStatusTable;
