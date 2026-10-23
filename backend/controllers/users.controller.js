const User = require("../models/user.models");
const bcrypt = require("bcryptjs")

const register = async (req, res) => {
    try {
        const { name, email, mobile, password, role } = req.body;
        if (!name || !email || !mobile || !password || !role) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already exist"
            });
        }

        // Password Security
        const hashPassword = await bcrypt.hash(password,10);

        // Create

        await User.create({
            name,
            email,
            mobile,
            password: hashPassword,
            role
        });

        return res.status(201).json({
            message: " Account created successfully.",
            success: true
        })


    } catch (error) {
        console.log(error);
        
    }
}

    ////  Login ////

const login = async (req,res)=>{
    try {
        const {email,password} = req.body;

        if(!email || !password)
        {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const user = await User.findOne({email});
        const isPasswordMatch = await bcrypt.compare(password,user.password);

        if(!user || !isPasswordMatch)
        {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        };

        ////  Tokenization ////


    } catch (error) {
        console.log(error);
        
    }
}


module.exports = {register, login};

