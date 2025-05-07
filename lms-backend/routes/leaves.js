const express = require("express");
const router = express.Router();
const {
  createLeave,
  getLeaves,
  getLeave,
  updateLeave,
  deleteLeave,
} = require("../controllers/leave");
const { protect } = require("../middleware/auth");

// All routes are protected
router.use(protect);

router.route("/").post(createLeave).get(getLeaves);

router.route("/:id").get(getLeave).put(updateLeave).delete(deleteLeave);

module.exports = router;
