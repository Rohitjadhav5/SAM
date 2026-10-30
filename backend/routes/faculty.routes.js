const express = require("express");
const router = express.Router();
const Auth = require("../middleware/auth.middleware");
const Role = require("../middleware/role.middleware");

const {
  getMyProfile,
  getMyStudents,
  markManualAttendance,
} = require("../controllers/faculty.controller");

// Faculty Profile
router.get("/myprofile", Auth, Role("faculty"), getMyProfile);

// Department Students
router.get("/student", Auth, Role("faculty"), getMyStudents);

// Manual Attendance
router.post("/manualattendance", Auth, Role("faculty"), markManualAttendance);

module.exports = router;
