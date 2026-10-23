const mongoose = requre("mongoose");

const attendanceModel = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        enum: ["Present", "Absent", "Late"],
        required: true,
    },
    method: {
        type: String,
        enum: ["QR", "Manual"],
        requred: true,
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    markedAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true});

module.exports = mongoose.model("Attendance", attendanceModel);