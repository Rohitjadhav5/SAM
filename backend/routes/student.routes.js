const express = require("express")
const Auth = require("../middleware/auth.middleware");
const Role = require("../middleware/role.middleware");
const {createProfile,getMyProfile,getMyAttendance,getAttendanceSummary} = require("../controllers/student.controller")
const route = express.Router();

route.post('/createProfile',Auth,Role("student"),createProfile);
route.get('/myProfile',Auth,Role("student"),getMyProfile);
route.get('/myAttendance',Auth,Role("student"),getMyAttendance);
route.get('/attendanceSummary',Auth,Role("student"),getAttendanceSummary);

module.exports = route;