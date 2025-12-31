import crypto from 'crypto'
import { User } from '../models/User.js';
// import {redisClient} from '../index.js' // Removed Redis


export const generateCSRFToken = async (userId, res) => {
    const csrfToken = crypto.randomBytes(32).toString("hex");

    // await redisClient.setEx(csrfKey,3600,csrfToken); // Removed Redis

    // Update User
    const user = await User.findById(userId);
    if (user) {
        user.csrfToken = csrfToken;
        await user.save();
    }
    res.cookie("csrfToken", csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
    });

    return csrfToken;
};

export const verifyCSRFToken = async (req, res, next) => {
    try {
        if (req.method === "GET") {
            return next();
        }

        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated",
            });
        }

        const clientToken = req.headers["x-csrf-token"] || req.headers["x-xsrf-token"] || req.headers["csrf-token"];

        if (!clientToken) {
            return res.status(403).json({
                message: "CSRF token missing. Please include the 'X-CSRF-Token' header.",
                code: "CSRF_TOKEN_MISSING",
            });
        }

        // Use req.user if populated by isAuth, otherwise fetch from DB
        let storedToken = req.user?.csrfToken;
        if (!storedToken) {
            const user = await User.findById(userId);
            storedToken = user ? user.csrfToken : null;
        }

        if (!storedToken) {
            return res.status(403).json({
                message: "CSRF token expired or not found. Please login again.",
                code: "CSRF_TOKEN_EXPIRED",
            });
        }

        if (storedToken !== clientToken) {
            return res.status(403).json({
                message: "Invalid CSRF token. Please refresh your session.",
                code: "CSRF_TOKEN_INVALID",
            });
        }

        next();

    }
    catch (error) {
        console.log("CSRF verification error:", error);
        return res.status(500).json({
            message: "CSRF verification failed.",
            code: "CSRF_VERIFICATION_ERROR",
        });
    }
};

export const revokeCSRFTOKEN = async (userId) => {
    const user = await User.findById(userId);
    if (user) {
        user.csrfToken = undefined;
        await user.save();
    }
    // await redisClient.del(csrfKey);

};

export const refreshCSRFToken = async (userId, res) => {
    await revokeCSRFTOKEN(userId);
    return await generateCSRFToken(userId, res);
}