const mongoose = require("mongoose");
const User = require("../models/user.models");
const Faculty = require("../models/faculty.models");
const Student = require("../models/student.models");
const Attendance = require("../models/attendance.models");

const STATUSES = ["Present", "Absent", "Late"];

// Verify the logged-in Faculty account.
const getFaculty = async (req, res) => {
  if (!mongoose.isValidObjectId(req.id)) {
    res.status(401).json({ 
      message: "Please log in first." 

    });
    return null;
  }

  const user = await User.findById(req.id).select("name email mobile role");
  if (!user || user.role !== "faculty") {
    res.status(user ? 403 : 401).json({ 
      message: "Faculty access only." 
    });
    return null;
  }

  const faculty = await Faculty.findOne({ user: user._id });
  if (!faculty) {
    res.status(404).json({ 
      message: "Faculty profile not found." 
    });
    return null;
  }

  return { user, faculty };
};

// 1. View Faculty profile.
const getMyProfile = async (req, res) => {
  try {
    const ctx = await getFaculty(req, res);
    if (!ctx) return;

    const profile = await Faculty.findById(ctx.faculty._id)
      .populate("user", "name email mobile role");

    return res.json({ 
      success: true, 
      data: profile 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Could not load profile." });
  }
};

// 2. View students in the Faculty's department.
const getMyStudents = async (req, res) => {
  try {
    const ctx = await getFaculty(req, res);
    if (!ctx) return;

    const filter = { department: ctx.faculty.department };
    for (const field of ["semester", "year"]) {
      if (req.query[field] === undefined) continue;
      const value = Number(req.query[field]);
      if (!Number.isInteger(value) || value < 1 || value > 8) {
        return res.status(400).json({ 
          message: `Invalid ${field}.` 
        });
      }
      filter[field] = value;
    }

    const students = await Student.find(filter)
      .select("collegeId department semester year user")
      .populate("user", "name email mobile")
      .sort({ collegeId: 1 });

    return res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Could not load students." });
  }
};

// 3. Mark or update today's manual attendance.
const markManualAttendance = async (req, res) => {
  try {
    const ctx = await getFaculty(req, res);
    if (!ctx) return;

    const records = req.body?.records;
    if (!Array.isArray(records) || records.length < 1 || records.length > 300) {
      return res.status(400).json({ 
        message: "Send 1–300 attendance records." 
      });
    }

    const ids = records.map((r) => String(r?.studentId || ""));
    if (ids.some((id) => !mongoose.isValidObjectId(id)) || new Set(ids).size !== ids.length) {
      return res.status(400).json({ 
        message: "Student IDs must be valid and unique." 
      });
    }
    if (records.some((r) => !STATUSES.includes(r?.status))) {
      return res.status(400).json({ 
        message: "Status must be Present, Absent or Late." 
      });
    }

    const students = await Student.find({
      _id: { $in: ids }, department: ctx.faculty.department,
    }).select("_id");
    if (students.length !== ids.length) {
      return res.status(403).json({ 
        message: "Some students are outside your department." 
      });
    }

    const now = new Date();
    const start = new Date(now);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    let created = 0;
    let updated = 0;
    for (const record of records) {
      const filter = {
        student: record.studentId,
        markedBy: ctx.user._id,
        markedAt: { $gte: start, $lt: end },
      };
      const existing = await Attendance.findOne(filter).select("_id");

      await Attendance.findOneAndUpdate(filter, {
        $set: { status: record.status, method: "Manual", markedAt: now },
        $setOnInsert: { student: record.studentId, markedBy: ctx.user._id },
      }, { upsert: true, new: true, runValidators: true });

      existing ? updated++ : created++;
    }

    return res.json({ success: true, message: "Attendance saved.", data: { total: records.length, created, updated } });
  } catch (error) {
    console.error(error);
    return res.status(error.code === 11000 ? 409 : 500).json({
      message: error.code === 11000 ? "Duplicate attendance record." : "Could not save attendance.",
    });
  }
};

module.exports = { getMyProfile, getMyStudents, markManualAttendance };
