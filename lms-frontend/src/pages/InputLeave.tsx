import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LeaveForm from "@/components/LeaveForm";
import FloatingActionButton from "@/components/FloatingActionButton";
import { runAutomation } from "@/services/automationService";
import { useState } from "react";
import AutomationDialog from "@/components/AutomationDialog";

const InputLeave = () => {
  const navigate = useNavigate();
  const [isRunningAutomation, setIsRunningAutomation] = useState(false);
  const [isAutomationDialogOpen, setIsAutomationDialogOpen] = useState(false);

  const handleSuccess = () => {
    // Do nothing, stay on the same page after submission
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
    } finally {
      setIsRunningAutomation(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Input Leave Data</h1>
              <p className="text-gray-600">
                Manually create a new leave application
              </p>
            </div>
          </div>

          <Card className="max-w-2xl mx-auto" id="leave-application-card">
            <CardHeader>
              <CardTitle>Leave Application Form</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaveForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </main>
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
      </div>
    </>
  );
};

export default InputLeave;
