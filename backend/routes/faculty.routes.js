const express = require("express");
const route = express.Router();
const Auth = require("../middleware/auth.middleware");
const Role = require("../middleware/role.middleware");
const { getMyProfile, getMyStudents, markManualAttendance } = require("../controllers/faculty.controller")

route.get('/myprofile',Auth,Role("faculty"),getMyProfile);
route.get('/student',Auth,Role("faculty"),getMyStudents);
route.post('/manualattendance',Auth,Role("faculty"),markManualAttendance);


module.exports = route;