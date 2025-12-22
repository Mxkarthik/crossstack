// there are total two tokens refresh token and access token
import jwt from 'jsonwebtoken'
import { redisClient } from "../index.js"

export const generateToken = async (id,res) => {
    const accessToken = jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn : "2m",
    });

    const refreshToken = jwt.sign({id},process.env.REFRESH_SECRET,{
        expiresIn : "7d",
    });

    const refreshTokenKey = `refresh_token:${id}`;

    await redisClient.setEx(refreshTokenKey , 7 * 24 * 60 * 60 , refreshToken);

    res.cookie("accessToken",accessToken, {
        httpOnly:true,  
        // secure: true,
        sameSite: "strict", // the csrf attack chances will be reduced
        maxAge: 1* 60 * 1000, 
    });

    res.cookie("refreshToken",refreshToken,{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
        sameSite: "none",
        // secure: true,
    });

    return { accessToken , refreshToken };
};