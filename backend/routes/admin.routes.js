const express = require("express")
const Auth = require("../middleware/auth.middleware");
const Role = require("../middleware/role.middleware");
const {getAttendance, updateAttendance } = require("../controllers/admin.controller")
const route = express.Router();

route.get('/attendance',Auth,Role("admin"),getAttendance);
route.put('/updateattendance',Auth,Role("admin"),updateAttendance);

module.exports = route;