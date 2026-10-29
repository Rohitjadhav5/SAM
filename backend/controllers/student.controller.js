const Student = require("../models/student.models");
const Attendance = require("../models/attendance.models");
// const Leave = require("../models/leave.models");
// const Complaint = require("../models/complaint.models");

// Helper: find the student profile of the logged-in user
const findStudent = async (req) => {
    return await Student.findOne({ userId: req.user.userId });
};

//// 1. Create student profile ////
const createProfile = async (req, res) => {
    try {
        const { collegeId, department, semester, year, parentWhatsapp } = req.body;

        if (!collegeId || !department || !semester || !year) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const alreadyHasProfile = await Student.findOne({ userId: req.user.userId });
        if (alreadyHasProfile) {
            return res.status(400).json({ message: "Profile already exists", success: false });
        }

        const collegeIdTaken = await Student.findOne({ collegeId });
        if (collegeIdTaken) {
            return res.status(400).json({ message: "College ID already registered", success: false });
        }

        const student = await Student.create({
            userId: req.user.userId,
            collegeId,
            department,
            semester,
            year,
            parentWhatsapp
        });

        return res.status(201).json({ message: "Profile created", success: true, student });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

//// 2. Get my profile ////
const getMyProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.userId })
            .populate("userId", "name email mobile");

        if (!student) {
            return res.status(404).json({ message: "Profile not found", success: false });
        }

        return res.status(200).json({ success: true, student });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

//// 3. Get my attendance (filters: ?date=2026-10-24&subject=Maths) ////
const getMyAttendance = async (req, res) => {
    try {
        const student = await findStudent(req);
        if (!student) {
            return res.status(404).json({ message: "Profile not found", success: false });
        }

        const filter = { studentId: student._id };

        if (req.query.date) {
            const start = new Date(req.query.date);
            const end = new Date(req.query.date);
            end.setDate(end.getDate() + 1);
            filter.date = { $gte: start, $lt: end };
        }

        let records = await Attendance.find(filter)
            .populate("classId", "subjectName semester academicYear")
            .sort({ date: -1 });

        if (req.query.subject) {
            records = records.filter(
                (r) => r.classId && r.classId.subjectName.toLowerCase() === req.query.subject.toLowerCase()
            );
        }

        return res.status(200).json({ success: true, count: records.length, records });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

//// 4. Subject-wise attendance percentage ////
const getAttendanceSummary = async (req, res) => {
    try {
        const student = await findStudent(req);
        if (!student) {
            return res.status(404).json({ message: "Profile not found", success: false });
        }

        const records = await Attendance.find({ studentId: student._id })
            .populate("classId", "subjectName");

        const summary = {};

        records.forEach((r) => {
            if (!r.classId) return;
            const subject = r.classId.subjectName;

            if (!summary[subject]) {
                summary[subject] = { total: 0, present: 0 };
            }
            summary[subject].total += 1;
            if (r.status === "present") summary[subject].present += 1;
        });

        const result = Object.keys(summary).map((subject) => {
            const { total, present } = summary[subject];
            return {
                subject,
                totalSessions: total,
                present,
                percentage: Number(((present / total) * 100).toFixed(2))
            };
        });

        return res.status(200).json({ success: true, summary: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

//// 5. Apply for leave ////
const applyLeave = async (req, res) => {
    try {
        const { fromDate, toDate, reason } = req.body;

        if (!fromDate || !toDate || !reason) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        if (new Date(fromDate) > new Date(toDate)) {
            return res.status(400).json({ message: "From date cannot be after To date", success: false });
        }

        const student = await findStudent(req);
        if (!student) {
            return res.status(404).json({ message: "Profile not found", success: false });
        }

        const leave = await Leave.create({
            studentId: student._id,
            fromDate,
            toDate,
            reason
        });

        return res.status(201).json({ message: "Leave request submitted", success: true, leave });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

//// 6. My leave requests ////
const getMyLeaves = async (req, res) => {
    try {
        const student = await findStudent(req);
        if (!student) {
            return res.status(404).json({ message: "Profile not found", success: false });
        }

        const leaves = await Leave.find({ studentId: student._id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, leaves });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

//// 7. Raise complaint ////
const raiseComplaint = async (req, res) => {
    try {
        const { subject, description } = req.body;

        if (!subject || !description) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const student = await findStudent(req);
        if (!student) {
            return res.status(404).json({ message: "Profile not found", success: false });
        }

        const complaint = await Complaint.create({
            studentId: student._id,
            subject,
            description
        });

        return res.status(201).json({ message: "Complaint submitted", success: true, complaint });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

//// 8. My complaints ////
const getMyComplaints = async (req, res) => {
    try {
        const student = await findStudent(req);
        if (!student) {
            return res.status(404).json({ message: "Profile not found", success: false });
        }

        const complaints = await Complaint.find({ studentId: student._id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, complaints });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

module.exports = {createProfile,getMyProfile,getMyAttendance,getAttendanceSummary};