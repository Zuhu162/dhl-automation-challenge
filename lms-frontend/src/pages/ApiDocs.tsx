import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Code,
  Database,
  FileJson,
  MessageSquare,
} from "lucide-react";

const ApiDocs = () => {
  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">API Documentation</h1>
            <p className="text-gray-600">
              Integration guide for UiPath automation
            </p>
          </div>

          <div className="grid gap-6 mb-8">
            <Card>
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-b">
                <CardTitle className="flex items-center">
                  <ArrowRight className="mr-2 h-5 w-5 text-dhl-yellow" />
                  UiPath Integration Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p>
                  This leave management system supports integration with UiPath
                  for automated data entry from Excel files. The integration
                  allows you to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Automatically read leave data from Excel sheets</li>
                  <li>Submit multiple leave applications at once</li>
                  <li>
                    Avoid creating duplicate entries by checking existing
                    records
                  </li>
                  <li>
                    Track automation processes via automation-logs endpoint
                  </li>
                  <li>Generate reports on successful and failed submissions</li>
                  <li>
                    Handle errors with screenshots and email notifications
                  </li>
                </ul>

                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
                  <p className="font-medium text-amber-800">
                    To launch the UiPath automation:
                  </p>
                  <p className="text-amber-700 mt-1">
                    Click the floating action button on the bottom right of the
                    screen in the dashboard. This will open a dialog with
                    instructions and initiate the automation process.
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2">
                    Excel Data Format Requirements:
                  </h3>
                  <p className="mb-2">
                    Ensure your Excel file has the following columns:
                  </p>
                  <table className="min-w-full text-sm border rounded-md overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Column Name</th>
                        <th className="px-4 py-2 text-left">Data Type</th>
                        <th className="px-4 py-2 text-left">Example</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="px-4 py-2 font-medium">Employee ID</td>
                        <td className="px-4 py-2">String</td>
                        <td className="px-4 py-2">"1001"</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">Employee Name</td>
                        <td className="px-4 py-2">String</td>
                        <td className="px-4 py-2">"John Doe"</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">Leave Type</td>
                        <td className="px-4 py-2">
                          String (Annual, Medical, Emergency, Other)
                        </td>
                        <td className="px-4 py-2">"Annual"</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">Start Date</td>
                        <td className="px-4 py-2">Date (DD-MM-YYYY)</td>
                        <td className="px-4 py-2">"10/05/2025"</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">End Date</td>
                        <td className="px-4 py-2">Date (DD-MM-YYYY)</td>
                        <td className="px-4 py-2">"10/05/2025"</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">Status</td>
                        <td className="px-4 py-2">
                          String (Pending, Approved, Rejected)
                        </td>
                        <td className="px-4 py-2">"Rejected"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card id="endpoints">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5 text-blue-500" />
                  API Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-md mr-2 text-xs">
                        GET
                      </span>
                      /api/leaves
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Get all leave applications
                    </p>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-md border">
                        <p className="text-xs text-gray-500 mb-1">Request:</p>
                        <code className="text-sm">GET /api/leaves</code>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md border">
                        <p className="text-xs text-gray-500 mb-1">Response:</p>
                        <code className="text-sm whitespace-pre">{`[
  {
    "id": "1",
    "employeeId": "1001",
    "employeeName": "John Doe",
    "leaveType": "Annual",
    "startDate": "2023-11-15",
    "endDate": "2023-11-20",
    "status": "Approved",
    "createdAt": "2023-11-10T09:30:00Z"
  },
  {
    "id": "2",
    "employeeId": "1002",
    "employeeName": "Jane Smith",
    "leaveType": "Medical",
    "startDate": "2023-11-22",
    "endDate": "2023-11-25",
    "status": "Pending",
    "createdAt": "2023-11-12T14:15:00Z"
  }
]`}</code>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md mr-2 text-xs">
                        POST
                      </span>
                      /api/leaves
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Create a new leave application
                    </p>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-md border">
                        <p className="text-xs text-gray-500 mb-1">Request:</p>
                        <code className="text-sm whitespace-pre">{`POST /api/leaves
Content-Type: application/json

{
  "employeeId": "1001",
  "employeeName": "John Doe",
  "leaveType": "Annual",
  "startDate": "2023-11-15",
  "endDate": "2023-11-20",
  "status": "Pending"
}`}</code>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md border">
                        <p className="text-xs text-gray-500 mb-1">Response:</p>
                        <code className="text-sm whitespace-pre">{`{
  "id": "3",
  "employeeId": "1001",
  "employeeName": "John Doe",
  "leaveType": "Annual",
  "startDate": "2023-11-15",
  "endDate": "2023-11-20",
  "status": "Pending",
  "createdAt": "2023-11-14T10:45:00Z"
}`}</code>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-md mr-2 text-xs">
                        GET
                      </span>
                      /api/automation-logs
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Retrieve automation process logs
                    </p>
                    <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mb-3">
                      <p className="text-sm text-yellow-800">
                        This endpoint returns logs of automation processes. It
                        is used to track UiPath bot activities.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-md border">
                        <p className="text-xs text-gray-500 mb-1">Request:</p>
                        <code className="text-sm">
                          GET /api/automation-logs
                        </code>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md border">
                        <p className="text-xs text-gray-500 mb-1">Response:</p>
                        <code className="text-sm whitespace-pre">{`[
  {
    "id": "1",
    "process": "Leave Import",
    "status": "Completed",
    "startTime": "2023-11-14T09:15:00Z",
    "endTime": "2023-11-14T09:18:30Z",
    "successRows": 15,
    "failedRows": 2,
    "notes": "Process completed with 2 failures"
  },
  {
    "id": "2",
    "process": "Leave Import",
    "status": "Failed",
    "startTime": "2023-11-13T14:22:00Z",
    "endTime": "2023-11-13T14:23:45Z",
    "successRows": 5,
    "failedRows": 10,
    "notes": "Process failed due to invalid data format"
  }
]`}</code>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md mr-2 text-xs">
                        POST
                      </span>
                      /api/automation-logs
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Create a new automation log entry
                    </p>
                    <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mb-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Important:</strong> This endpoint is used by the
                        UiPath bot to log process information. It should not be
                        called directly by other applications.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-md border">
                        <p className="text-xs text-gray-500 mb-1">Request:</p>
                        <code className="text-sm whitespace-pre">{`POST /api/automation-logs
Content-Type: application/json

{
  "process": "Leave Import",
  "status": "Completed",
  "startTime": "2023-11-14T09:15:00Z",
  "endTime": "2023-11-14T09:18:30Z",
  "successRows": 15,
  "failedRows": 2,
  "notes": "Process completed with 2 failures"
}`}</code>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md border">
                        <p className="text-xs text-gray-500 mb-1">Response:</p>
                        <code className="text-sm whitespace-pre">{`{
  "id": "3",
  "process": "Leave Import",
  "status": "Completed",
  "startTime": "2023-11-14T09:15:00Z",
  "endTime": "2023-11-14T09:18:30Z",
  "successRows": 15,
  "failedRows": 2,
  "notes": "Process completed with 2 failures",
  "createdAt": "2023-11-14T09:18:35Z"
}`}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default ApiDocs;
