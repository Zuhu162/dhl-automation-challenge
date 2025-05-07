import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import LeaveTable from "@/components/LeaveTable";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, LayoutDashboard, Users } from "lucide-react";
import { leaveService } from "@/services/leaveService";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const applications = await leaveService.getAll();

      // Calculate stats from the applications array
      const stats = {
        total: applications.length,
        pending: applications.filter((app) => app.status === "Pending").length,
        approved: applications.filter((app) => app.status === "Approved")
          .length,
        rejected: applications.filter((app) => app.status === "Rejected")
          .length,
      };

      // Calculate percentages
      const pendingPercentage =
        stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;

      const approvedPercentage =
        stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

      setStats(stats);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch leave applications");
      // Set default stats on error
      setStats({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Calculate percentages for display
  const pendingPercentage =
    stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;

  const approvedPercentage =
    stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600">Welcome to DHL Leave Management</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card className="bg-gradient-to-br from-dhl-red to-red-500 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Total Applications</span>
                  <LayoutDashboard className="h-5 w-5" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">
                    {isLoading ? "..." : stats.total}
                  </span>
                  <p className="text-sm opacity-80 mt-1">
                    Leave requests this month
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Pending</span>
                  <Calendar className="h-5 w-5 text-yellow-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-yellow-600">
                    {isLoading ? "..." : stats.pending}
                  </span>
                  <div className="mt-2">
                    <Progress
                      value={pendingPercentage}
                      className="h-2 bg-yellow-100"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {pendingPercentage}% of total
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Approved</span>
                  <Users className="h-5 w-5 text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-green-600">
                    {isLoading ? "..." : stats.approved}
                  </span>
                  <div className="mt-2">
                    <Progress
                      value={approvedPercentage}
                      className="h-2 bg-green-100"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {approvedPercentage}% of total
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Rejected</span>
                  <FileText className="h-5 w-5 text-red-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-red-600">
                    {isLoading ? "..." : stats.rejected}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Last updated today
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="applications" className="px-6">
                Leave Applications
              </TabsTrigger>
              <TabsTrigger value="integration" className="px-6">
                UiPath Integration
              </TabsTrigger>
            </TabsList>
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Leave Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <LeaveTable onRefresh={handleRefresh} isLoading={isLoading} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="integration">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    UiPath Integration Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    This leave management system supports integration with
                    UiPath for automated data entry from Excel files. The
                    integration allows you to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Automatically read leave data from Excel sheets</li>
                    <li>Submit multiple leave applications at once</li>
                    <li>
                      Avoid creating duplicate entries by checking existing
                      records
                    </li>
                    <li>
                      Generate reports on successful and failed submissions
                    </li>
                    <li>
                      Handle errors with screenshots and email notifications
                    </li>
                  </ul>
                  <div className="pt-4 flex gap-4">
                    <button
                      onClick={() => navigate("/api-docs")}
                      className="bg-dhl-yellow hover:bg-yellow-500 text-black px-4 py-2 rounded">
                      View API Documentation
                    </button>
                    <button
                      onClick={() => navigate("/upload")}
                      className="bg-dhl-red hover:bg-red-700 text-white px-4 py-2 rounded">
                      Upload Excel File
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <FloatingActionButton
            to="/upload"
            label="Automate Input with Spreadsheet Link"
          />
        </main>
      </div>
    </>
  );
};

export default Index;
