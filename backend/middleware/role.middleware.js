const User = require("../models/user.models");

const role = (...allowedRoles) => async (req, res, next) => {
    try {
        if (!req.id) {
            return res.status(401).json({
                message: "User is not Authorized"
            });
        }

        const user = await User.findById(req.id).select("role");
        if (!user) {
            return res.status(401).json({
                message: "User is not Authorized"
            });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                message: "No Permission"
            });
        }

        return next();
    } catch (error) {
        return next(error);
    }
};

module.exports = role;