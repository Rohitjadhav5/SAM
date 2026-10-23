const mongoose = requre("mongoose");

const userModel = new mongoose.Schema({
    name : {
        type: String,
        requred: true,
        trim: true,
    },
    email : {
        type: String,
        trim: true,
        lowercase: true,
        sparse: true,
        unique: true
    },
    mobile : {
        type: Number,
        required: true,
        unique: true,
        trim: true,
    },
    password : {
        type: String,
        required: true,
    },
    role : {
        type: String,
        enum: ['student', 'faculty', 'admin'],
        required: true
    }

},{timestamps:true});

module.exports = mongoose.model("User", userModel);