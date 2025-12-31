import jwt from 'jsonwebtoken'
// import { redisClient } from '../index.js'; // Removed Redis
import { User } from '../models/User.js';


export const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(403).json({
                message: "Please Login - no token",
            });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedData) {
            return res.status(400).json({
                message: "Token Expired",
            });
        }
        // Removed Redis cache check

        const user = await User.findById(decodedData.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        // await redisClient.setEx(`user:${user._id}`,3600,JSON.stringify(user)); // Removed Redis set

        req.user = user;
        next();
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Role: ${req.user.role} is not allowed to access this resource`,
            });
        }
        next();
    }
}