import { registerSchema } from "../config/zod.js"
import TryCatch from "../middlewares/TryCatch.js";
import { redisClient } from "../index.js"
import { User } from "../models/User.js"
import sanitize from "mongo-sanitize";
import bcrypt from "bcrypt";


export const registerUser = TryCatch(async(req,res)=>{
    const sanitizedBody = sanitize(req.body);

    const validation = registerSchema.safeParse(sanitizedBody);

    if(!validation.success) {
        const zodError = validation.error;

        let firstErrorMessage = "Validation Failed"
        let allErrors = [];

        if(zodError?.issues && Array.isArray(zodError.issues)) {
            allErrors = zodError.issues.map((issue)=>({
                field: issue.path ? issue.path.join("."):"unknown",
                message: issue.message || "Validation Error",
                code: issue.code,
            }));

            firstErrorMessage = allErrors[0].message || "Validation Error";
        }
        return res.status(400).json({
            message: firstErrorMessage,
            error: allErrors,
        });
    }

    const {name ,email ,password} = validation.data;

    const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;

    if(await redisClient.get(rateLimitKey) ){
        return res.status(429).json({
            message:"Too Many Requests, try again later",
        });
    }

    const existingUser = await User.findOne({email})

    if(existingUser){
        return res.status(400).json({
            message:"User already exists",
        })
    }
        
    const hashPassword = await bcrypt.hash(password,10);
        
    res.json({
        name,
        email,
        password,
    });
});