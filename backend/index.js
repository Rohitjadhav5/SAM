const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db")
const userRoute = require("./routes/user.route");
const adminRoute = require("./routes/admin.routes");
const facultyRoute = require("./routes/faculty.routes");
const attendanceRoute = require("./routes/attendance.routes");
const studentRoute = require("./routes/student.routes");

app.use(express.json());
app.use(cookieParser());


app.use("/api/user",userRoute);
app.use("/api/admin",adminRoute);
app.use("/api/faculty",facultyRoute);
app.use("/api/attendance",attendanceRoute);
app.use("/api/student",studentRoute);




dotenv.config({});
const PORT = process.env.PORT || 5000;
app.listen((PORT), ()=>{
    connectDB();
    console.log("Server is up")
})