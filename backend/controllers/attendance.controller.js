const Attendance = require("../models/attendance.models");
const User = require("../models/user.models");


// MARK ATTENDANCE

const markAttendance = async (req, res) => {

    try {

        const { studentId, facultyId, className, subject } = req.body;

        if (!studentId || !facultyId || !className || !subject) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        // Check Student

        const student = await User.findById(studentId);

        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        // Check Duplicate Attendance

        const existingAttendance =
            await Attendance.findOne({

                student: studentId,
                subject: subject

            });

        if (existingAttendance) {

            return res.status(400).json({
                message:
                    "Attendance already marked"
            });

        }

        // Create Attendance

        await Attendance.create({

            student: studentId,

            faculty: facultyId,

            lectureId: lectureId,

            className,

            subject,

            status: "Present"

        });

        return res.status(201).json({

            success: true,

            message:
                "Attendance marked successfully"

        });

    } catch (error) {

        console.log(error);

    }

};



// GET STUDENT ATTENDANCE

const getAttendance = async (req, res) => {

    try {

        const { studentId } = req.params;

        const attendance =
            await Attendance.find({

                student: studentId

            })

                .populate(
                    "student",
                    "name email"
                );

        return res.status(200).json({

            success: true,

            attendance

        });

    } catch (error) {

        console.log(error);

    }

};


// ATTENDANCE PERCENTAGE


const attendancePercentage =
    async (req, res) => {

        try {

            const { studentId }
                = req.params;

            const totalClasses =
                await Attendance.countDocuments({

                    student: studentId

                });

            const presentClasses =
                await Attendance.countDocuments({

                    student: studentId,

                    status: "Present"

                });

            const percentage = totalClasses === 0
                ? 0
                : (
                    (presentClasses / totalClasses) * 100
                );

            return res.status(200).json({

                totalClasses,

                presentClasses,

                percentage

            });

        } catch (error) {

            console.log(error);

        }

    };



// FACULTY REPORT

const getFacultyReport =
    async (req, res) => {

        try {

            const report =
                await Attendance.find()

                    .populate(
                        "student",
                        "name email mobile"
                    )

                    .populate(
                        "faculty",
                        "name email"
                    );

            return res.status(200).json({

                success: true,

                report

            });

        } catch (error) {

            console.log(error);

        }

    };




// ADMIN DASHBOARD

const adminDashboard =
    async (req, res) => {

        try {

            const totalStudents =
                await User.countDocuments({
                    role: "student"
                });

            const totalFaculty =
                await User.countDocuments({
                    role: "faculty"
                });

            const totalAttendance =
                await Attendance.countDocuments();

            return res.status(200).json({

                totalStudents,

                totalFaculty,

                totalAttendance

            });

        } catch (error) {

            console.log(error);

        }

    };

//UPDATE ATTENDANCE
const updateAttendance = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;
        const attendance =
            await Attendance.findById(id);

        if (!attendance) {

            return res.status(404).json({
                message: "Attendance not found"
            });

        }

        await Attendance.findByIdAndUpdate(

            id,

            {
                status
            },

            {
                new: true
            }

        );

        return res.status(200).json({

            success: true,

            message:
                "Attendance updated successfully"

        });

    } catch (error) {

        console.log(error);

    }

};

// DELETE ATTENDANCE


const deleteAttendance =
    async (req, res) => {

        try {

            const { id } =
                req.params;

            await Attendance.findByIdAndDelete(id);

            return res.status(200).json({

                success: true,

                message:
                    "Attendance deleted successfully"

            });

        } catch (error) {

            console.log(error);

        }

    };


// EXPORTS

module.exports = { markAttendance, getAttendance, attendancePercentage, getFacultyReport, adminDashboard, updateAttendance, deleteAttendance };