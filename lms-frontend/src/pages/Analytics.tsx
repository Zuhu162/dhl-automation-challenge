import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { leaveService } from "@/services/leaveService";
import EmployeeStatusTable from "@/components/EmployeeStatusTable";
import EmployeeModal from "@/components/EmployeeModal";
import { toast } from "sonner";
import PastelStatsSection from "@/components/PastelStatsSection";
import useEmployeeFilter from "@/hooks/useEmployeeFilter";
import { PieChartComponent } from "@/components/charts/PieChartComponent";
import { BarChartComponent } from "@/components/charts/BarChartComponent";

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

  const {
    filteredEmployees,
    isModalOpen,
    handleCardClick,
    closeModal,
    getModalTitle,
  } = useEmployeeFilter();

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

      // Format monthly data for charts with proper sorting
      const monthOrder = [
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

      setMonthlyData(
        Object.entries(monthlyLeaves)
          .map(([name, value]) => ({
            name,
            value,
            order: monthOrder.indexOf(name),
          }))
          .sort((a, b) => a.order - b.order)
          .map(({ name, value }) => ({ name, value }))
      );
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare data for the pie chart
  const statusData = [
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

          {/* Stats Cards - Pastel Theme */}
          <div className="animate-fadeIn">
            <PastelStatsSection
              stats={stats}
              isLoading={isLoading}
              onCardClick={handleCardClick}
            />
          </div>

          {/* Charts and Tables */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Leave Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <PieChartComponent
                  data={statusData}
                  loading={isLoading}
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Types</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <PieChartComponent
                  data={leaveTypeData}
                  colors={leaveTypeColors}
                  loading={isLoading}
                  height={300}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Leave Applications</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <BarChartComponent
                  data={monthlyData}
                  loading={isLoading}
                  height={300}
                  xAxisLabel="Month"
                  yAxisLabel="Number of Applications"
                  color="#8884d8"
                />
              </CardContent>
            </Card>
          </div>

          {/* Employee Status Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Leave Status</CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeStatusTable isLoading={isLoading} />
            </CardContent>
          </Card>

          {/* Employee Modal */}
          <EmployeeModal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={getModalTitle()}
            employees={filteredEmployees}
          />
        </main>
      </div>
    </>
  );
};

export default Analytics;
