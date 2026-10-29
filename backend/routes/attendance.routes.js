const express = require("express")
const Auth = require("../middleware/auth.middleware");
const Role = require("../middleware/role.middleware");
const {markAttendance, getAttendance, attendancePercentage, getFacultyReport, adminDashboard, updateAttendance, deleteAttendance } = require("../controllers/attendance.controller")
const route = express.Router();

route.post('/mark',Auth,Role("faculty"),markAttendance);
route.get('/attendance',Auth,Role("student"),getAttendance);
route.get('/dashboard',Auth,Role("admin"),adminDashboard);
route.get('/percentage',Auth,Role("student"),attendancePercentage);
route.get('/facultyReport',Auth,Role("admin"),getFacultyReport);
route.put('/updateAttendance',Auth,Role("admin"),updateAttendance);
route.delete('/delete',Auth,Role("admin"),deleteAttendance);

module.exports = route;