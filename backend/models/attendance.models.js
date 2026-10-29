const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    lectureId: {
        type: String,
        required: true
    },

    className: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["Present", "Absent", "Late"],
        default: "Present"
    },

    method: {
        type: String,
        enum: ["QR", "Manual"],
        default: "QR"
    },

    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    markedAt: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Attendance",attendanceSchema);





































// const mongoose = require("mongoose");

// const attendanceModel = new mongoose.Schema({
//     student: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Student",
//         required: true
//     },
//     class: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Class",
//         required: true
//     },
//     status: {
//         type: mongoose.Schema.Types.ObjectId,
//         enum: ["Present", "Absent", "Late"],
//         required: true,
//         default: "Present"
//     },
//     method: {
//         type: String,
//         enum: ["QR", "Manual"],
//         requred: true,
//     },
//     markedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     },
//     markedAt: {
//         type: Date,
//         default: Date.now
//     }
// },{timestamps: true});

// module.exports = mongoose.model("Attendance", attendanceModel);