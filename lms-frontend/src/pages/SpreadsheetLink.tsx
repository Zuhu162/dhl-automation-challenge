
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FileSpreadsheet, LinkIcon } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SpreadsheetLink = () => {
  const navigate = useNavigate();
  const [spreadsheetLink, setSpreadsheetLink] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validate Google Sheets URL format
  const validateSpreadsheetUrl = (url: string) => {
    // Basic validation for Google Sheets URL
    const regex = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9_-]+\/edit(\?[^#]*)?#?gid=[0-9]+$/;
    return regex.test(url);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setSpreadsheetLink(link);
    setIsValid(validateSpreadsheetUrl(link));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) return;
    
    setIsProcessing(true);

    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful upload
      const timestamp = new Date().toISOString();
      const logEntry = {
        id: crypto.randomUUID(),
        timestamp,
        status: "success",
        message: `Successfully processed spreadsheet`,
        details: `Processed data from ${spreadsheetLink}`,
        executionTime: "1.5s",
        fileName: "Google Spreadsheet",
        fileSize: 0
      };
      
      // Store log in localStorage
      const logs = JSON.parse(localStorage.getItem("upload_logs") || "[]");
      logs.push(logEntry);
      localStorage.setItem("upload_logs", JSON.stringify(logs));
      
      toast.success("Spreadsheet processed successfully!");
      navigate("/input-leave");
    } catch (error) {
      toast.error("Error processing spreadsheet");
    } finally {
      setIsProcessing(false);
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
              <h1 className="text-3xl font-bold">Spreadsheet Link</h1>
              <p className="text-gray-600">Import leave applications from a Google Spreadsheet</p>
            </div>
          </div>
          
          <Card className="w-full max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-center mb-4">
                    <FileSpreadsheet className="h-16 w-16 text-dhl-red" />
                  </div>
                  
                  <label htmlFor="spreadsheet-link" className="text-lg font-medium">
                    Google Spreadsheet Link
                  </label>
                  
                  <div className="relative flex items-center">
                    <LinkIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="spreadsheet-link"
                      type="text"
                      className="pl-10"
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      value={spreadsheetLink}
                      onChange={handleLinkChange}
                      disabled={isProcessing}
                    />
                  </div>
                  
                  {spreadsheetLink && !isValid && (
                    <p className="text-red-500 text-sm">
                      Please enter a valid Google Spreadsheet URL (format: https://docs.google.com/spreadsheets/d/ID/edit?gid=NUMBER)
                    </p>
                  )}
                  
                  <p className="text-gray-500 text-sm mt-2">
                    The spreadsheet must be publicly accessible or shared with viewing permissions
                  </p>
                </div>
                
                {isProcessing && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div className="bg-dhl-red h-2.5 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Processing spreadsheet data...</p>
                  </div>
                )}
                
                <div className="flex justify-end mt-6 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/")}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={!isValid || isProcessing}
                    className="bg-dhl-red hover:bg-red-700"
                  >
                    {isProcessing ? "Processing..." : "Submit"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default SpreadsheetLink;
