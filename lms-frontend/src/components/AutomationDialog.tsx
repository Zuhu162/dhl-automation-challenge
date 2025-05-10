import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AutomationDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isRunningAutomation: boolean;
  onRunAutomation: () => void;
}

const AutomationDialog: React.FC<AutomationDialogProps> = ({
  isOpen,
  setIsOpen,
  isRunningAutomation,
  onRunAutomation,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>UiPath Automation</DialogTitle>
          <DialogDescription>
            You are about to run the UiPath automation process for leave data
            entry.
            <li>Make sure the Excel file is in the correct format.</li>
            <li>
              <a
                href="https://docs.google.com/spreadsheets/d/10DW-C7t6xAd29Ozk-zAvgTbc_Q-oqdcP/edit?gid=1759902208#gid=1759902208"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800">
                Sample Link
              </a>
            </li>
            <li>
              Also, please ensure that there are no browser tabs currently open
              with the Leave Management System before proceeding.
            </li>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <h4 className="font-medium mb-2">
            This automated input process will:
          </h4>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>Validate your Excel file to check if it has proper headers</li>
            <li>Check for duplicate rows within the Excel file</li>
            <li>
              Check for rows with missing data/invalid data (e.g., Start Date
              &gt; End Date)
            </li>
            <li>Remove problematic data</li>
            <li>Only proceed with the valid data</li>
            <li>
              Go to the input leave data page and start manually inputting each
              valid row of the spreadsheet
            </li>
            <li>Log all automation activity to the system's automation-logs</li>
            <li>Provide a success email or error email in case of failure</li>
          </ol>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={onRunAutomation}
            className="bg-dhl-yellow hover:bg-yellow-500 text-black"
            disabled={isRunningAutomation}>
            {isRunningAutomation ? "Running..." : "Run Automation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AutomationDialog;
