import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {
  RefreshCcw,
  CheckCircle,
  XCircle,
  FileWarning,
  ChevronRight,
} from "lucide-react";
import {
  getAllAutomationLogs,
  type AutomationLog as AutomationLogType,
} from "@/services/automationLogService";
import { AutomationLogsTable } from "@/components/AutomationLogsTable";

const AutomationLogs = () => {
  const [logs, setLogs] = useState<AutomationLogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await getAllAutomationLogs();
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setLogs(sortedData);
      setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
      setError(null);
    } catch (err) {
      console.error("Error loading automation logs:", err);
      setError("Failed to load automation logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Legend item component
  const LegendItem = ({
    color,
    icon,
    text,
  }: {
    color: string;
    icon: React.ReactNode;
    text: string;
  }) => (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1">
        {icon}
        {text}
      </span>
    </div>
  );

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Automation Logs</h1>
              <p className="text-gray-600">
                History of automation runs and their results
              </p>
            </div>
            <button
              onClick={loadLogs}
              className="mt-4 md:mt-0 flex items-center gap-1 px-4 py-2 bg-dhl-yellow hover:bg-yellow-500 text-black rounded">
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {/* Status Legend */}
          <div className="bg-white rounded-lg border p-4 mb-6 shadow-sm">
            <h3 className="text-lg font-medium mb-3">Status Legend</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LegendItem
                color="bg-green-50"
                icon={<CheckCircle className="h-4 w-4 text-green-500" />}
                text="Complete: All rows successfully input"
              />
              <LegendItem
                color="bg-yellow-50"
                icon={<FileWarning className="h-4 w-4 text-yellow-500" />}
                text="Partial: Process stopped before completion"
              />
              <LegendItem
                color="bg-red-50"
                icon={<XCircle className="h-4 w-4 text-red-500" />}
                text="Failed: Could not start input process"
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p className="mb-1">
                <strong>Rows Processed:</strong> Shows as{" "}
                <strong>Valid / Invalid / Total</strong> rows
              </p>
              <p className="flex items-center mb-1">
                <ChevronRight className="h-4 w-4 mr-1" /> Click on any row to
                view more details
              </p>
              <p className="ml-5">
                Additional information such as remarks will be shown in the
                expanded view
              </p>
            </div>
          </div>

          {error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-500">{error}</p>
              <button
                onClick={loadLogs}
                className="mt-4 px-4 py-2 bg-dhl-yellow hover:bg-yellow-500 text-black rounded">
                Try Again
              </button>
            </div>
          ) : (
            <div className="max-w-full overflow-x-auto">
              <AutomationLogsTable
                logs={logs}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AutomationLogs;
