import express from 'express'
import {registerUser} from "../controllers/user.js";
import {verifyUser} from "../controllers/user.js";
import {loginUser} from "../controllers/user.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify/:token", verifyUser);
router.post("/login",loginUser);
export default router;