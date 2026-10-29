const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        unique: true 

    },
    collegeId: { 
        type: String, 
        required: true, 
        unique: true 
        
    },
    department: { 
        type: String, 
        required: true 
        
    },
    semester: { 
        type: Number, 
        required: true 
        
    },
    year: { 
        type: Number, 
        required: true 
        
    },
    parentWhatsapp: { 
        type: String 
        
    }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);





















// const mongoose = require("mongoose");

// const studentModel = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//         unique: true
//     },
//     collegeId: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true
//     },
//     department: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     semester: {
//         type: Number,
//         required: true,
//         min: 1,
//         max: 8
//     },
//     year: {
//         type: Number,
//         required: true,
//     }
// },{timestamps: true});

// module.exports = mongoose.model("Student", studentModel);