const mongoose = require("mongoose");

const studentModel = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    collegeId: {
        type: string,
        required: true,
        unique: true,
        trim: true
    },
    department: {
        type: string,
        requred: true,
        trim: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    year: {
        type: Number,
        requred: true,
    }
},{timestamps: true});

module.exports = mongoose.model("Student", studentModel);