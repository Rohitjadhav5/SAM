const User = require("../models/user.models");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
    try {
        const { name, email, mobile, password, role } = req.body;
        const normalizedRole = typeof role === "string" ? role.trim().toLowerCase() : "";
        if (!name || !email || !mobile || !password || !normalizedRole) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const validRoles = User.schema.path("role").enumValues;
        if (!validRoles.includes(normalizedRole)) {
            return res.status(400).json({
                message: `Role must be one of: ${validRoles.join(", ")}`
            });
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
            role: normalizedRole
        });

        return res.status(201).json({
            message: " Account created successfully.",
            success: true
        })


    } catch (error) {
        console.error("User registration failed:", error);
        return res.status(500).json({
            message: "Unable to register user"
        });
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

        const user = await User.findOne({email: email.trim().toLowerCase()});
        const isPasswordMatch = user
            ? await bcrypt.compare(password,user.password)
            : false;

        if(!user || !isPasswordMatch)
        {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        };

        ////  Tokenization ////

        if (!process.env.JWT_KEY) {
            console.error("Login failed: JWT_KEY is not configured");
            return res.status(500).json({
                message: "Unable to log in",
                success: false
            });
        }

        const tokenData = {
            userId: user._id
        };
        const token = jwt.sign(tokenData,process.env.JWT_KEY,{expiresIn:'1d'});

        return res.status(200).cookie("token", token,{maxAge: 1*24*60*60*1000, httpOnly:true, sameSite:'strict'}).json({
            message: "Logged in successfully",
            success: true,
            token,
            _id:user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });


    } catch (error) {
        console.log(error);
        
    }
}

const logout =(req,res) =>{
    try {
        return res.status(200).cookie("token", "",{maxAge: 0}).json({
            message: "Logged out successfully"
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {register, login,logout};
