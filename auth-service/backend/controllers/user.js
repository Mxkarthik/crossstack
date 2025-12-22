import { registerSchema } from "../config/zod.js"
import TryCatch from "../middlewares/TryCatch.js";
import sanitize from "mongo-sanitize";

export const registerUser = TryCatch(async(req,res)=>{
    const sanitizedBody = sanitize(req.body);

    const validation = registerSchema.safeParse(sanitizedBody);

    if(!validation.success) {
        return res.status(400).json({
            message: "validation error",
        });
    }

    const {name ,email ,password} = validation.data;

    res.json({
        name,
        email,
        password,
    });
});