const AutomationLog = require("../models/AutomationLog");
const Leave = require("../models/Leave");

// @desc    Create a new automation log
// @route   POST /api/automation-logs
// @access  Private
exports.createAutomationLog = async (req, res) => {
  try {
    const {
      status,
      timeStart,
      timeEnd,
      successfulRows,
      failedRows,
      totalRows,
      remarks,
      spreadsheetLink,
    } = req.body;

    // Create automation log
    const automationLog = await AutomationLog.create({
      status,
      timeStart,
      timeEnd,
      successfulRows,
      failedRows,
      totalRows,
      remarks,
      spreadsheetLink,
    });

    res.status(201).json({
      success: true,
      data: automationLog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all automation logs
// @route   GET /api/automation-logs
// @access  Private
exports.getAutomationLogs = async (req, res) => {
  try {
    const automationLogs = await AutomationLog.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: automationLogs.length,
      data: automationLogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single automation log
// @route   GET /api/automation-logs/:id
// @access  Private
exports.getAutomationLog = async (req, res) => {
  try {
    const automationLog = await AutomationLog.findById(req.params.id);

    if (!automationLog) {
      return res.status(404).json({
        success: false,
        message: "Automation log not found",
      });
    }

    res.status(200).json({
      success: true,
      data: automationLog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update automation log
// @route   PUT /api/automation-logs/:id
// @access  Private
exports.updateAutomationLog = async (req, res) => {
  try {
    let automationLog = await AutomationLog.findById(req.params.id);

    if (!automationLog) {
      return res.status(404).json({
        success: false,
        message: "Automation log not found",
      });
    }

    // Update automation log
    automationLog = await AutomationLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: automationLog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete automation log
// @route   DELETE /api/automation-logs/:id
// @access  Private
exports.deleteAutomationLog = async (req, res) => {
  try {
    const automationLog = await AutomationLog.findById(req.params.id);

    if (!automationLog) {
      return res.status(404).json({
        success: false,
        message: "Automation log not found",
      });
    }

    await automationLog.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Restore system to the state at a given automation log
// @route   POST /api/automation-logs/:id/restore
// @access  Private
exports.restoreVersion = async (req, res) => {
  try {
    const automationLog = await AutomationLog.findById(req.params.id);
    if (!automationLog) {
      return res.status(404).json({
        success: false,
        message: "Automation log not found",
      });
    }
    const restorePoint = automationLog.createdAt;
    // Delete all leave applications created after the restore point
    const leaveResult = await Leave.deleteMany({
      createdAt: { $gt: restorePoint },
    });
    // Delete all automation logs created after the restore point
    const logResult = await AutomationLog.deleteMany({
      createdAt: { $gt: restorePoint },
    });
    res.status(200).json({
      success: true,
      message: `Restored system to state at automation log ${req.params.id}`,
      deletedLeaveCount: leaveResult.deletedCount,
      deletedLogCount: logResult.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
