const mongoose = require("mongoose");
const User = require("../models/user.models");
const Attendance = require("../models/attendance.models")
const Admin = require("../models/admin.models")


const attendanceStatus = ["Present", "Absent", "Late"];

const getAttendance = async (req, res) => {
    const { studentId, classId, status } = req.query;
    const filter = {};

    if (studentId) {
        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).json({
                message: "Invalid Student ID"
            })
        }

        filter.student = studentId;
    }

    if (classId) {
        if (!mongoose.isValidObjectId(classId)) {
            return res.status(400).json({
                message: "Invalid Class ID"
            })
        }

        filter.class = classId;
    }

    if (status) {
        if (!attendanceStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid attendance status"
            })
        }

        filter.status = status;
    }

    const attendance = await Admin.find(filter).populate({
        path: "student",
        select: "colledgeId department year semester section",
        populate: { path: "user", select: "name email mobile" }
    })
        .populate("class", "subject subjectCode department year semester section")
        .populate("markedBy", "name email role")
        .sort({ markedAt: -1 });

    return res.status(200).json({ attendance });
};

const updateAttendance = async (req, res) => {
    const { attendanceId } = req.params;
    const { status, markedAt } = req.body;

    if (!mongoose.isValidObjectId(attendanceId)) {
        return res.status(400).json({ 
            message: "Invalid attendanceId" 
        });
    }
    if (!attendanceStatuses.includes(status)) {
        return res.status(400).json({ 
            message: "A valid status is required" 
        });
    }

    const changes = { status, method: "Admin", markedBy: req.id };
    if (markedAt !== undefined) {
        const date = new Date(markedAt);
        if (Number.isNaN(date.getTime())) {
            return res.status(400).json({ 
                message: "Invalid markedAt date" 
            });
        }
        changes.markedAt = date;
    }

    const attendance = await Admin.findByIdAndUpdate(
        attendanceId,
        { $set: changes },
        { new: true, runValidators: true }
    )
        .populate({
            path: "student",
            select: "collegeId department year semester section",
            populate: { path: "user", select: "name email" }
        })
        .populate("class", "subject subjectCode year semester section");

    if (!attendance) {
        return res.status(404).json({ 
            message: "Attendance record not found" 

        });
    }
    return res.status(200).json({ 
        message: "Attendance updated", attendance 

    });
};


module.exports = {getAttendance, updateAttendance }