const mongoose = require("mongoose");

const User = require("../models/user.models");
const Faculty = require("../models/faculty.models");
const Student = require("../models/student.models");
const Attendance = require("../models/attendance.models");

const STATUSES = ["Present", "Absent", "Late"];

// Verify Faculty account
const getFaculty = async (req, res) => {
  if (!mongoose.isValidObjectId(req.id)) {
    res.status(401).json({ message: "Please log in first." });
    return null;
  }

  const user = await User.findById(req.id).select("name email mobile role");

  if (!user || user.role !== "faculty") {
    res.status(user ? 403 : 401).json({
      message: "Faculty access only.",
    });
    return null;
  }

  const faculty = await Faculty.findOne({ user: user._id });

  if (!faculty) {
    res.status(404).json({
      message: "Faculty profile not found.",
    });
    return null;
  }

  if (!faculty.department) {
    res.status(400).json({
      message: "Faculty department not assigned.",
    });
    return null;
  }

  return { user, faculty };
};

// 1. View Faculty Profile
const getMyProfile = async (req, res) => {
  try {
    const ctx = await getFaculty(req, res);
    if (!ctx) return;

    const profile = await Faculty.findById(ctx.faculty._id).populate(
      "user",
      "name email mobile role",
    );

    return res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Could not load profile.",
    });
  }
};

// 2. View Department Students
const getMyStudents = async (req, res) => {
  try {
    const ctx = await getFaculty(req, res);
    if (!ctx) return;

    const filter = {
      department: ctx.faculty.department,
    };

    for (const [field, max] of [
      ["semester", 8],
      ["year", 4],
    ]) {
      if (req.query[field] === undefined) continue;

      const value = Number(req.query[field]);

      if (!Number.isInteger(value) || value < 1 || value > max) {
        return res.status(400).json({
          message: `Invalid ${field}.`,
        });
      }

      filter[field] = value;
    }

    const students = await Student.find(filter)
      .select("collegeId department semester year userId")
      .populate("userId", "name email mobile")
      .sort({ collegeId: 1 });

    return res.json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Could not load students.",
    });
  }
};

// 3. Mark or Update Manual Attendance
const markManualAttendance = async (req, res) => {
  try {
    const ctx = await getFaculty(req, res);
    if (!ctx) return;

    const { lectureId, className, subject, records } = req.body || {};

    if (
      typeof lectureId !== "string" ||
      !lectureId.trim() ||
      typeof className !== "string" ||
      !className.trim() ||
      typeof subject !== "string" ||
      !subject.trim()
    ) {
      return res.status(400).json({
        message: "Lecture ID, class name and subject are required.",
      });
    }

    if (!Array.isArray(records) || records.length < 1 || records.length > 300) {
      return res.status(400).json({
        message: "Send 1–300 attendance records.",
      });
    }

    const ids = records.map((record) => String(record?.studentId || ""));

    if (
      ids.some((id) => !mongoose.isValidObjectId(id)) ||
      new Set(ids).size !== ids.length
    ) {
      return res.status(400).json({
        message: "Student IDs must be valid and unique.",
      });
    }

    if (records.some((record) => !STATUSES.includes(record?.status))) {
      return res.status(400).json({
        message: "Status must be Present, Absent or Late.",
      });
    }

    // Verify students belong to Faculty department
    const students = await Student.find({
      _id: { $in: ids },
      department: ctx.faculty.department,
    }).select("_id userId");

    if (students.length !== ids.length) {
      return res.status(403).json({
        message: "Some students are outside your department.",
      });
    }

    if (students.some((student) => !student.userId)) {
      return res.status(400).json({
        message: "Some student accounts are not properly linked.",
      });
    }

    const studentMap = new Map(
      students.map((student) => [student._id.toString(), student]),
    );

    const now = new Date();

    // Prepare bulk attendance operations
    const operations = records.map((record) => {
      const student = studentMap.get(record.studentId.toString());

      return {
        updateOne: {
          filter: {
            student: student.userId,
            faculty: ctx.user._id,
            lectureId: lectureId.trim(),
          },

          update: {
            $set: {
              faculty: ctx.user._id,
              className: className.trim(),
              subject: subject.trim(),
              status: record.status,
              method: "Manual",
              markedBy: ctx.user._id,
              markedAt: now,
            },

            $setOnInsert: {
              student: student.userId,
              lectureId: lectureId.trim(),
            },
          },

          upsert: true,
        },
      };
    });

    const result = await Attendance.bulkWrite(operations, { ordered: true });

    return res.json({
      success: true,
      message: "Attendance saved successfully.",
      data: {
        total: records.length,
        created: result.upsertedCount,
        updated: result.matchedCount,
      },
    });
  } catch (error) {
    console.error(error);

    return res
      .status(
        error.code === 11000
          ? 409
          : error.name === "ValidationError"
            ? 400
            : 500,
      )
      .json({
        message:
          error.code === 11000
            ? "Duplicate attendance record."
            : error.name === "ValidationError"
              ? "Invalid attendance data."
              : "Could not save attendance.",
      });
  }
};

module.exports = {
  getMyProfile,
  getMyStudents,
  markManualAttendance,
};
