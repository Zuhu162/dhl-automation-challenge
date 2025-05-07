
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { leaveService } from "@/services/leaveService";

const UploadExcel = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Only accept Excel files
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      toast.error("Please upload an Excel file");
      return;
    }

    setIsUploading(true);

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful upload
      const timestamp = new Date().toISOString();
      const logEntry = {
        id: crypto.randomUUID(),
        timestamp,
        status: "success",
        message: `Successfully uploaded ${file.name}`,
        details: `Processed ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
        executionTime: "1.5s",
        fileName: file.name,
        fileSize: file.size
      };
      
      // Store log in localStorage
      const logs = JSON.parse(localStorage.getItem("upload_logs") || "[]");
      logs.push(logEntry);
      localStorage.setItem("upload_logs", JSON.stringify(logs));
      
      toast.success("File uploaded successfully!");
      navigate("/logs");
    } catch (error) {
      toast.error("Error uploading file");
    } finally {
      setIsUploading(false);
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
              <h1 className="text-3xl font-bold">Upload Excel File</h1>
              <p className="text-gray-600">Import leave applications from an Excel file</p>
            </div>
          </div>
          
          <Card className="w-full max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragging 
                    ? "border-dhl-red bg-red-50" 
                    : "border-gray-300 hover:border-dhl-red hover:bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                
                <Upload className="h-16 w-16 mx-auto text-dhl-red" />
                <h3 className="text-xl font-medium mt-4">Upload Excel File</h3>
                <p className="text-gray-500 mt-2">Drag & Drop or Click to Browse</p>
                {isUploading && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div className="bg-dhl-red h-2.5 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Uploading...</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default UploadExcel;
