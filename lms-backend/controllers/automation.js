const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

// @desc    Trigger UiPath automation
// @route   POST /api/automation/trigger
// @access  Public
exports.triggerAutomation = async (req, res) => {
  try {
    // Get the project root directory
    const projectRoot = path.resolve(process.cwd());
    console.log(`Project root: ${projectRoot}`);

    // Path to LeaveAutomation folder at the project root level
    // Try different relative paths to find the correct location
    let automationDirPath = "";
    const possiblePaths = [
      path.resolve(projectRoot, "../LeaveAutomation"),
      path.resolve(projectRoot, "./LeaveAutomation"),
      path.resolve(projectRoot, "../../LeaveAutomation"),
      path.resolve(projectRoot, "LeaveAutomation"),
    ];

    // Find the first path that exists
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        automationDirPath = possiblePath;
        console.log(`Found automation directory at: ${automationDirPath}`);
        break;
      }
    }

    if (!automationDirPath) {
      console.error(
        `Could not find LeaveAutomation directory in any of the searched paths`
      );
      return res.status(404).json({
        success: false,
        message: "LeaveAutomation directory not found",
        searchedPaths: possiblePaths,
      });
    }

    // Path to Main.xaml
    const mainXamlPath = path.join(automationDirPath, "Main.xaml");
    console.log(`Main.xaml path: ${mainXamlPath}`);

    // Check if Main.xaml exists
    if (!fs.existsSync(mainXamlPath)) {
      console.error(`Automation file not found at: ${mainXamlPath}`);
      return res.status(404).json({
        success: false,
        message: `Automation file Main.xaml not found at ${mainXamlPath}`,
      });
    }

    console.log("Found Main.xaml file, attempting to execute...");

    // Determine OS-specific command
    let command = "";
    if (os.platform() === "win32") {
      // Try Windows-specific command to open file with default program
      command = `start "" "${mainXamlPath}"`;
    } else {
      // For non-Windows systems, try a more generic approach
      command = `xdg-open "${mainXamlPath}"`;
    }

    console.log(`Executing command: ${command}`);

    // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Execution error: ${error}`);

        // Try fallback method if first attempt fails
        console.log("First attempt failed, trying fallback method...");

        // Fallback: Try to execute using the current directory context
        const fallbackCommand = `cd "${automationDirPath}" && (if exist Main.xaml (start Main.xaml))`;
        console.log(`Executing fallback command: ${fallbackCommand}`);

        exec(
          fallbackCommand,
          (fallbackError, fallbackStdout, fallbackStderr) => {
            if (fallbackError) {
              console.error(`Fallback execution error: ${fallbackError}`);
              return res.status(500).json({
                success: false,
                message: "All attempts to execute automation failed",
                error: {
                  firstAttempt: error.message,
                  fallbackAttempt: fallbackError.message,
                },
              });
            }

            console.log(
              "Automation triggered successfully using fallback method"
            );
            return res.status(200).json({
              success: true,
              message:
                "Automation triggered successfully using fallback method",
              output: fallbackStdout || "Automation launched",
            });
          }
        );

        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).json({
          success: false,
          message: "Error in automation execution",
          error: stderr,
        });
      }

      console.log("Automation triggered successfully");
      return res.status(200).json({
        success: true,
        message: "Automation triggered successfully",
        output: stdout || "Automation launched",
      });
    });
  } catch (error) {
    console.error("Error triggering automation:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
