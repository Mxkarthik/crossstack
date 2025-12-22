import express from 'express'
import {registerUser} from "../controllers/user.js";
import {verifyUser} from "../controllers/user.js";
import {loginUser} from "../controllers/user.js";
import {verifyOtp} from "../controllers/user.js";
import {myProfile} from "../controllers/user.js";
import { isAuth } from '../middlewares/isAuth.js';
import { refreshToken } from '../controllers/user.js';


const router = express.Router();

router.post("/register", registerUser);
router.post("/verify/:token", verifyUser);
router.post("/login",loginUser);
router.post("/verify",verifyOtp);
router.get("/me",isAuth,myProfile);
router.post("/refresh", refreshToken);
export default router;