import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, CheckCircle, XCircle } from "lucide-react";
import { leaveService } from "@/services/leaveService";
import { LeaveApplication } from "@/types";
import { ChartContainer } from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import EmployeeStatusTable from "@/components/EmployeeStatusTable";
import EmployeeModal from "@/components/EmployeeModal";
import { toast } from "sonner";

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    onLeave: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [leaveTypeData, setLeaveTypeData] = useState<
    Array<{ name: string; value: number }>
  >([]);
  const [monthlyData, setMonthlyData] = useState<
    Array<{ name: string; value: number }>
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredEmployees, setFilteredEmployees] = useState<
    LeaveApplication[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = async () => {
    try {
      setIsLoading(true);
      const applications = await leaveService.getAll();
      const currentDate = new Date();

      // Calculate current on leave count
      const onLeave = applications.filter((app) => {
        const startDate = new Date(app.startDate);
        const endDate = new Date(app.endDate);
        return (
          app.status === "Approved" &&
          startDate <= currentDate &&
          endDate >= currentDate
        );
      }).length;

      // Calculate status counts
      const statusCounts = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate leave type distribution
      const leaveTypeCounts = applications.reduce((acc, app) => {
        acc[app.leaveType] = (acc[app.leaveType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate monthly distribution
      const monthlyLeaves = applications.reduce((acc, app) => {
        const month = new Date(app.startDate).getMonth();
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const monthName = monthNames[month];
        acc[monthName] = (acc[monthName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setStats({
        onLeave,
        pending: statusCounts.Pending || 0,
        approved: statusCounts.Approved || 0,
        rejected: statusCounts.Rejected || 0,
      });

      // Format leave type data for charts
      setLeaveTypeData(
        Object.entries(leaveTypeCounts).map(([name, value]) => ({
          name,
          value,
        }))
      );

      // Format monthly data for charts
      setMonthlyData(
        Object.entries(monthlyLeaves).map(([name, value]) => ({
          name,
          value,
        }))
      );
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = async (category: string) => {
    try {
      const applications = await leaveService.getAll();
      const currentDate = new Date();

      let filtered: LeaveApplication[] = [];

      switch (category) {
        case "onLeave":
          filtered = applications.filter((app) => {
            const startDate = new Date(app.startDate);
            const endDate = new Date(app.endDate);
            return (
              app.status === "Approved" &&
              startDate <= currentDate &&
              endDate >= currentDate
            );
          });
          break;
        case "pending":
          filtered = applications.filter((app) => app.status === "Pending");
          break;
        case "approved":
          filtered = applications.filter((app) => app.status === "Approved");
          break;
        case "rejected":
          filtered = applications.filter((app) => app.status === "Rejected");
          break;
      }

      setFilteredEmployees(filtered);
      setSelectedCategory(category);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      toast.error("Failed to load employee data");
    }
  };

  // Prepare data for the pie chart
  const pieData = [
    { name: "Approved", value: stats.approved, color: "#4caf50" },
    { name: "Pending", value: stats.pending, color: "#ff9800" },
    { name: "Rejected", value: stats.rejected, color: "#f44336" },
  ];

  // Colors for the leave type chart
  const leaveTypeColors = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d"];

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-gray-600">
                Leave management statistics and insights
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCardClick("onLeave")}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Currently On Leave</span>
                  <Calendar className="h-5 w-5 text-dhl-red" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">
                    {isLoading ? "..." : stats.onLeave}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click to view details
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCardClick("pending")}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Pending Approval</span>
                  <Users className="h-5 w-5 text-yellow-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-yellow-600">
                    {isLoading ? "..." : stats.pending}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Awaiting review
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCardClick("approved")}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Approved</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-green-600">
                    {isLoading ? "..." : stats.approved}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total approved leaves
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCardClick("rejected")}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Rejected</span>
                  <XCircle className="h-5 w-5 text-red-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-red-600">
                    {isLoading ? "..." : stats.rejected}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total rejected leaves
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Tables */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Leave Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Loading chart data...
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Types</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Loading chart data...
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leaveTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }>
                        {leaveTypeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              leaveTypeColors[index % leaveTypeColors.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Leave Applications</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Loading chart data...
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <EmployeeStatusTable />
          </div>
        </main>
      </div>

      {isModalOpen && (
        <EmployeeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          employees={filteredEmployees}
          title={`${
            selectedCategory === "onLeave"
              ? "Currently On Leave"
              : selectedCategory === "pending"
              ? "Pending Approval"
              : selectedCategory === "approved"
              ? "Approved Leaves"
              : "Rejected Leaves"
          }`}
        />
      )}
    </>
  );
};

export default Analytics;
