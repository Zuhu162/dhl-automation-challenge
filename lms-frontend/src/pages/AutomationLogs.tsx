import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { RefreshCcw } from "lucide-react";
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

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1">
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
            <AutomationLogsTable
              logs={logs}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>
    </>
  );
};

export default AutomationLogs;
