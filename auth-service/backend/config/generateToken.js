// there are total two tokens refresh token and access token
import jwt from 'jsonwebtoken'
// import { redisClient } from "../index.js" // Removed Redis
import { User } from "../models/User.js"
import { generateCSRFToken } from "./csrfMiddleware.js"
import { revokeCSRFTOKEN } from "./csrfMiddleware.js"

export const generateToken = async (id, res) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ id }, process.env.REFRESH_SECRET, {
        expiresIn: "7d",
    });

    const refreshTokenKey = `refresh_token:${id}`;

    // Store in DB
    const user = await User.findById(id);
    if (user) {
        user.refreshToken = refreshToken;
        await user.save();
    }
    // await redisClient.setEx(refreshTokenKey, 7 * 24 * 60 * 60, refreshToken); // Removed Redis

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
    });

    const csrfToken = await generateCSRFToken(id, res);

    return { accessToken, refreshToken, csrfToken };
};

export const verifyRefreshToken = async (refreshToken) => {
    try {
        const decode = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        // Find user by tokens
        const user = await User.findById(decode.id);

        if (!user || user.refreshToken !== refreshToken) {
            return null;
        }

        return decode;
    } catch (error) {
        return null;
    }
};

export const generateAccessToken = (id, res) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
    });
};

export const revokeRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    if (user) {
        user.refreshToken = undefined;
        await user.save();
    }
    // await redisClient.del(`refresh_token:${userId}`); // Removed Redis
    await revokeCSRFTOKEN(userId);
};   