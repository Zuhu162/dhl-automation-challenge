import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import LeaveTable from "@/components/LeaveTable";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  FileText,
  LayoutDashboard,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { leaveService } from "@/services/leaveService";
import { runAutomation } from "@/services/automationService";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import AutomationDialog from "../components/AutomationDialog";
import EmployeeModal from "@/components/EmployeeModal";
import { LeaveApplication } from "@/types";
import StatsSection from "@/components/StatsSection";
import useEmployeeFilter from "@/hooks/useEmployeeFilter";
import { UiPathIntegrationGuide } from "@/components/UiPathIntegrationGuide";

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    onLeave: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [isRunningAutomation, setIsRunningAutomation] = useState(false);
  const [isAutomationDialogOpen, setIsAutomationDialogOpen] = useState(false);

  const {
    filteredEmployees,
    isModalOpen,
    handleCardClick,
    closeModal,
    getModalTitle,
  } = useEmployeeFilter();

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
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

      setStats({
        onLeave,
        pending: statusCounts.Pending || 0,
        approved: statusCounts.Approved || 0,
        rejected: statusCounts.Rejected || 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch leave applications");
      // Set default stats on error
      setStats({
        onLeave: 0,
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

  const openAutomationDialog = () => {
    setIsAutomationDialogOpen(true);
  };

  const handleTriggerAutomation = async () => {
    if (isRunningAutomation) return;

    setIsAutomationDialogOpen(false);
    setIsRunningAutomation(true);

    try {
      await runAutomation();
      // After automation completes, refresh the data
      setTimeout(() => {
        handleRefresh();
      }, 5000); // Give some time for the automation to finish and update data
    } finally {
      setIsRunningAutomation(false);
    }
  };

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

          {/* Stats Cards - Enhanced with Colors */}
          <div className="animate-fadeIn">
            <StatsSection
              stats={stats}
              isLoading={isLoading}
              onCardClick={handleCardClick}
            />
          </div>

          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="applications" className="px-6">
                Leave Applications
              </TabsTrigger>
              <TabsTrigger value="automation" className="px-6">
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
            <TabsContent value="automation">
              <UiPathIntegrationGuide />
            </TabsContent>
          </Tabs>

          <FloatingActionButton
            onClick={openAutomationDialog}
            label={
              isRunningAutomation
                ? "Running Automation..."
                : "Run Leave Automation"
            }
          />

          <AutomationDialog
            isOpen={isAutomationDialogOpen}
            setIsOpen={setIsAutomationDialogOpen}
            isRunningAutomation={isRunningAutomation}
            onRunAutomation={handleTriggerAutomation}
          />

          {isModalOpen && (
            <EmployeeModal
              isOpen={isModalOpen}
              onClose={closeModal}
              employees={filteredEmployees}
              title={getModalTitle()}
            />
          )}
        </main>
      </div>
    </>
  );
};

export default Index;
