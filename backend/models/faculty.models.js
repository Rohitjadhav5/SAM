const mongoose = require("mongoose");

const facultyModel = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requred: true,
        unique: true
    },
    department: {
        type: String,
        requred: true,
        trim: true
    },
    email: {
        type: String,
        requred: true,
        unique: true,
        lowercase: true,
        trim: true,
        sparse: true
    }
},{timestamps: true});

module.exports = mongoose.model("Faculty", facultyModel);