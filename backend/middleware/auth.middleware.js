const jwt = require("jsonwebtoken");

const auth = async (req,res,next)=>{
    try {
        const token = req.cookies?.token;

        if(!token)
        {
            return res.status(401).json({
                message: "User is not Authorized"
            })
        };

        const decode = jwt.verify(token,process.env.JWT_KEY);

        if(!decode)
        {
            return res.status(401).json({
                message: "Invalid Token"
            })
        };

        req.id = decode.userId;

        next();

    } catch (error) {
        if(error instanceof jwt.JsonWebTokenError)
        {
            return res.status(401).json({
                message: "Invalid or Expired Token"
            });
        }

        next(error);
    }
}

module.exports = auth;