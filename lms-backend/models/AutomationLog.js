const mongoose = require("mongoose");

const AutomationLogSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["complete", "partial", "failed"],
      default: "failed",
    },
    timeStart: {
      type: String,
      required: true,
    },
    timeEnd: {
      type: String,
      required: true,
    },
    successfulRows: {
      type: String,
      required: true,
      default: 0,
    },
    failedRows: {
      type: String,
      required: true,
      default: 0,
    },
    totalRows: {
      type: String,
      required: false,
      default: 0,
    },
    remarks: {
      type: String,
      required: false,
      default: "",
    },
    spreadsheetLink: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AutomationLog", AutomationLogSchema);
