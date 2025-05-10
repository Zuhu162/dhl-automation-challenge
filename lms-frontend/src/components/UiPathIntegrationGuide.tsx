import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UiPathIntegrationGuide() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">UiPath Integration Guide</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          This leave management system supports integration with UiPath for
          automated data entry from Excel files. The integration allows you to:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Automatically read leave data from Excel sheets</li>
          <li>Submit multiple leave applications at once</li>
          <li>Avoid creating duplicate entries by checking existing records</li>
          <li>Track automation processes via automation-logs endpoint</li>
          <li>Generate reports on successful and failed submissions</li>
          <li>Handle errors with screenshots and email notifications</li>
        </ul>

        <div className="mt-4 bg-slate-50 p-4 rounded-md border border-slate-200">
          <h4 className="font-semibold mb-2">API Documentation Highlights</h4>
          <p className="text-sm mb-2">Key endpoints:</p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              <span className="font-mono bg-slate-100 px-1">
                GET /api/leaves
              </span>{" "}
              - Retrieve all leave applications
            </li>
            <li>
              <span className="font-mono bg-slate-100 px-1">
                POST /api/leaves
              </span>{" "}
              - Create a new leave application
            </li>
            <li>
              <span className="font-mono bg-slate-100 px-1">
                GET /api/automation-logs
              </span>{" "}
              - Retrieve automation process logs
            </li>
            <li>
              <span className="font-mono bg-slate-100 px-1">
                POST /api/automation-logs
              </span>{" "}
              - Create automation log entries (used by UiPath bot)
            </li>
          </ul>
        </div>

        <div className="pt-4 flex gap-4">
          <button
            onClick={() => navigate("/api-docs")}
            className="bg-dhl-yellow hover:bg-yellow-500 text-black px-4 py-2 rounded">
            View Full API Documentation
          </button>
          <button
            onClick={() => navigate("/automation-logs")}
            className="bg-dhl-red hover:bg-red-700 text-white px-4 py-2 rounded">
            View Automation Logs
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
