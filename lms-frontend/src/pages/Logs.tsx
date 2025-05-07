
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { 
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  RefreshCcw 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { mockUploadLogs } from "@/services/mockData";

interface LogEntry {
  id: string;
  timestamp: string;
  status: "success" | "error";
  message: string;
  details: string;
  executionTime: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    // Check if logs exist in localStorage, otherwise use mock data
    const storedLogs = localStorage.getItem("upload_logs");
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs).sort((a: LogEntry, b: LogEntry) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } else {
      // Store mock logs in localStorage and use them
      localStorage.setItem("upload_logs", JSON.stringify(mockUploadLogs));
      setLogs(mockUploadLogs.sort((a: LogEntry, b: LogEntry) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    }
  };
  
  const toggleLogExpansion = (id: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLogs(newExpanded);
  };
  
  const handleRestoreClick = (log: LogEntry) => {
    setSelectedLog(log);
    setIsAlertDialogOpen(true);
  };
  
  const handleRestore = () => {
    // In a real app, this would restore data from a backup
    toast.success("System data restored to selected version");
    setIsAlertDialogOpen(false);
  };

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">System Logs</h1>
              <p className="text-gray-600">Upload history and system events</p>
            </div>
          </div>
          
          {logs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No logs found. Upload an Excel file to see logs.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map(log => (
                <div 
                  key={log.id}
                  className={`border rounded-lg overflow-hidden ${
                    log.status === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleLogExpansion(log.id)}
                  >
                    <div className="flex items-center gap-3">
                      {log.status === "success" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">{log.message}</div>
                        <div className="text-sm text-gray-600">
                          {format(new Date(log.timestamp), "PPpp")} • {log.executionTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={log.status === "success" ? "outline" : "destructive"}>
                        {log.status === "success" ? "Success" : "Failed"}
                      </Badge>
                      {expandedLogs.has(log.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  
                  {expandedLogs.has(log.id) && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="p-3 bg-white rounded border">
                        <h4 className="font-medium mb-2">Details:</h4>
                        <p className="text-sm whitespace-pre-wrap">{log.details}</p>
                        
                        {log.fileName && (
                          <div className="mt-3">
                            <span className="text-sm font-medium">File: </span>
                            <span className="text-sm">{log.fileName} ({(log.fileSize! / 1024).toFixed(2)} KB)</span>
                          </div>
                        )}
                        
                        {log.error && (
                          <div className="mt-3">
                            <span className="text-sm font-medium">Error: </span>
                            <span className="text-sm text-red-500">{log.error}</span>
                          </div>
                        )}
                        
                        {log.status === "success" && (
                          <div className="mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRestoreClick(log);
                              }}
                              className="flex items-center gap-1 text-sm bg-dhl-yellow hover:bg-yellow-500 text-black px-3 py-1.5 rounded"
                            >
                              <RefreshCcw className="h-4 w-4" />
                              Restore to this version
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore System Data</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore the system data to this version?
              <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                <p><strong>Timestamp:</strong> {selectedLog && format(new Date(selectedLog.timestamp), "PPpp")}</p>
                <p><strong>File:</strong> {selectedLog?.fileName}</p>
              </div>
              <div className="mt-2 text-amber-600">
                This action cannot be undone. Current data will be replaced with the selected version.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore}>
              Yes, Restore Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Logs;
