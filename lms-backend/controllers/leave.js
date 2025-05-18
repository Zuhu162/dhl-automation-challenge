const Leave = require("../models/Leave");

// @desc    Create a new leave application
// @route   POST /api/leaves
// @access  Private
exports.createLeave = async (req, res) => {
  try {
    const {
      employeeId,
      employeeName,
      leaveType,
      startDate,
      endDate,
      status,
      isAutomated,
    } = req.body;

    // Duplicate check: prevent same employeeId, startDate, and endDate
    const duplicate = await Leave.findOne({
      employeeId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message:
          "Duplicate leave entry: This employee already has a leave for the same period.",
      });
    }

    // Create leave application
    const leave = await Leave.create({
      employeeId,
      employeeName,
      leaveType,
      startDate,
      endDate,
      status,
      isAutomated: isAutomated || false,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all leave applications
// @route   GET /api/leaves
// @access  Private
exports.getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single leave application
// @route   GET /api/leaves/:id
// @access  Private
exports.getLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update leave application
// @route   PUT /api/leaves/:id
// @access  Private
exports.updateLeave = async (req, res) => {
  try {
    let leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave application not found",
      });
    }

    // Update leave application
    leave = await Leave.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete leave application
// @route   DELETE /api/leaves/:id
// @access  Private
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave application not found",
      });
    }

    await leave.deleteOne();

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
