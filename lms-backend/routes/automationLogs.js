const express = require("express");
const router = express.Router();
const {
  createAutomationLog,
  getAutomationLogs,
  getAutomationLog,
  updateAutomationLog,
  deleteAutomationLog,
  restoreVersion,
} = require("../controllers/automationLog");

// Routes are no longer protected - no auth middleware
router.route("/").post(createAutomationLog).get(getAutomationLogs);

router
  .route("/:id")
  .get(getAutomationLog)
  .put(updateAutomationLog)
  .delete(deleteAutomationLog);

// Restore version endpoint
router.post("/:id/restore", restoreVersion);

module.exports = router;
