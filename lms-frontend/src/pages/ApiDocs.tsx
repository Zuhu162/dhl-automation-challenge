import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ApiDocs = () => {
  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">API Documentation</h1>
            <p className="text-gray-600">
              Integration guide for UiPath automation
            </p>
          </div>

          <Tabs defaultValue="endpoints" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="endpoints" className="px-6">
                API Endpoints
              </TabsTrigger>
              <TabsTrigger value="uipath" className="px-6">
                UiPath Instructions
              </TabsTrigger>
              <TabsTrigger value="examples" className="px-6">
                Sample Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="endpoints">
              <Card>
                <CardHeader>
                  <CardTitle>Available Endpoints</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      GET /api/leaves
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Get all leave applications
                    </p>
                    <div className="bg-gray-100 p-3 rounded-md">
                      <code>GET /api/leaves</code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      POST /api/leaves
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Create a new leave application
                    </p>
                    <div className="bg-gray-100 p-3 rounded-md">
                      <code>{`POST /api/leaves
{
  "employeeId": "1001",
  "employeeName": "John Doe",
  "leaveType": "Annual",
  "startDate": "2023-05-10",
  "endDate": "2023-05-15",
  "status": "Pending"
}`}</code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      GET /api/leaves/{"{id}"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Get a specific leave application
                    </p>
                    <div className="bg-gray-100 p-3 rounded-md">
                      <code>GET /api/leaves/123</code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      PUT /api/leaves/{"{id}"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Update a leave application status
                    </p>
                    <div className="bg-gray-100 p-3 rounded-md">
                      <code>{`PUT /api/leaves/123
{
  "status": "Approved"
}`}</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="uipath">
              <Card>
                <CardHeader>
                  <CardTitle>UiPath Integration Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Follow these steps to integrate with UiPath:</p>

                  <ol className="list-decimal ml-5 space-y-4">
                    <li>
                      <h3 className="font-medium">Excel Data Format</h3>
                      <p>Ensure your Excel file has the following columns:</p>
                      <ul className="list-disc ml-5 mt-2">
                        <li>Employee ID</li>
                        <li>Employee Name</li>
                        <li>Leave Type (Annual, Medical, Emergency, Other)</li>
                        <li>Start Date (YYYY-MM-DD format)</li>
                        <li>End Date (YYYY-MM-DD format)</li>
                      </ul>
                    </li>

                    <li>
                      <h3 className="font-medium">UiPath Workflow</h3>
                      <p>Create a workflow with these activities:</p>
                      <ul className="list-disc ml-5 mt-2">
                        <li>Read Range: To read data from Excel</li>
                        <li>
                          HTTP Request: To check for existing leave applications
                        </li>
                        <li>For Each Row: Process each record</li>
                        <li>HTTP Request: Submit leave application</li>
                        <li>Log Message: Record success/failure</li>
                      </ul>
                    </li>

                    <li>
                      <h3 className="font-medium">Error Handling</h3>
                      <p>Implement Try/Catch blocks to:</p>
                      <ul className="list-disc ml-5 mt-2">
                        <li>Capture screenshots on error</li>
                        <li>Log error details</li>
                        <li>Send error email to administrator</li>
                      </ul>
                    </li>

                    <li>
                      <h3 className="font-medium">Email Reporting</h3>
                      <p>After processing:</p>
                      <ul className="list-disc ml-5 mt-2">
                        <li>Generate summary of processed records</li>
                        <li>Send email with success/failure counts</li>
                        <li>Attach error screenshots if applicable</li>
                      </ul>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples">
              <Card>
                <CardHeader>
                  <CardTitle>Sample Code Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Check for Duplicates
                    </h3>
                    <div className="bg-gray-100 p-3 rounded-md">
                      <code>{`// UiPath - Check for duplicates
var checkUrl = "http://yourapp.com/api/leaves?employeeId=" + 
  currentRow("EmployeeId").ToString() + 
  "&startDate=" + currentRow("StartDate").ToString()

var checkRequest = new HttpRequest
checkRequest.Method = "GET"
checkRequest.Uri = new Uri(checkUrl)

var checkResponse = httpClient.SendAsync(checkRequest).Result
var existingLeaves = JObject.Parse(checkResponse.Content.ReadAsStringAsync().Result)

if (existingLeaves.Count > 0) {
  // Duplicate exists
  LogMessage("Duplicate leave application found for " + currentRow("EmployeeName").ToString())
  continueProcessing = false
}`}</code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Submit Leave Application
                    </h3>
                    <div className="bg-gray-100 p-3 rounded-md">
                      <code>{`// UiPath - Submit new leave
var submitUrl = "http://yourapp.com/api/leaves"

var leaveData = new JObject
leaveData["employeeId"] = currentRow("EmployeeId").ToString()
leaveData["employeeName"] = currentRow("EmployeeName").ToString()
leaveData["leaveType"] = currentRow("LeaveType").ToString()
leaveData["startDate"] = currentRow("StartDate").ToString()
leaveData["endDate"] = currentRow("EndDate").ToString()
leaveData["status"] = "Pending"

var submitRequest = new HttpRequest
submitRequest.Method = "POST"
submitRequest.Uri = new Uri(submitUrl)
submitRequest.Content = new StringContent(
  leaveData.ToString(), 
  Encoding.UTF8, 
  "application/json"
)

try {
  var response = httpClient.SendAsync(submitRequest).Result
  if (response.IsSuccessStatusCode) {
    successCount = successCount + 1
  } else {
    failureCount = failureCount + 1
    // Take screenshot
    TakeScreenshot("Error_" + currentRow("EmployeeId").ToString() + ".png")
  }
} catch (Exception ex) {
  failureCount = failureCount + 1
  LogMessage("Error: " + ex.Message)
  // Take screenshot
  TakeScreenshot("Exception_" + currentRow("EmployeeId").ToString() + ".png")
}`}</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default ApiDocs;
