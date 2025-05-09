const express = require("express");
const router = express.Router();
const { triggerAutomation } = require("../controllers/automation");

// Route to trigger UiPath automation
router.post("/trigger", triggerAutomation);

module.exports = router;
