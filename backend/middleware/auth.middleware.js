const jwt = require("jsonwebtoken");

const auth = async (req,res,next)=>{
    try {
        const authorization = req.get("authorization");
        const bearerToken = authorization?.startsWith("Bearer ")
            ? authorization.slice(7).trim()
            : "";
        const token = bearerToken || req.cookies?.token;

        if(!token)
        {
            return res.status(401).json({
                message: "User is not Authorized"
            })
        };

        if (!process.env.JWT_KEY) {
            return next(new Error("JWT_KEY is not configured"));
        }

        const decode = jwt.verify(token,process.env.JWT_KEY);
        if(!decode)
        {
            return res.status(401).json({
                message: "Invalid Token"
            })
        };

        req.id = decode.userId;
        req.user = decode;

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