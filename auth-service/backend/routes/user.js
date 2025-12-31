import express from 'express'
import { registerUser } from "../controllers/user.js";
import { verifyUser } from "../controllers/user.js";
import { loginUser } from "../controllers/user.js";
import { verifyOtp } from "../controllers/user.js";
import { myProfile } from "../controllers/user.js";
import { isAuth, authorizeRoles } from '../middlewares/isAuth.js';
import { refreshToken } from '../controllers/user.js';
import { logoutUser } from '../controllers/user.js';
import { verifyCSRFToken } from '../config/csrfMiddleware.js';
import { refreshCSRF } from '../controllers/user.js';
import { createInvite } from '../controllers/adminController.js';
import { acceptInvite } from '../controllers/user.js';




const router = express.Router();

router.post("/register", registerUser);
router.post("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.post("/verify", verifyOtp);
router.get("/me", isAuth, myProfile);
router.post("/refresh", refreshToken);
router.post("/logout", isAuth, verifyCSRFToken, logoutUser);
router.post("/refresh-csrf", isAuth, refreshCSRF)
router.get("/admin", isAuth, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Admin Access Granted" });
});

router.post("/invite", isAuth, verifyCSRFToken, authorizeRoles("admin"), createInvite);
router.post("/accept-invite", acceptInvite);

export default router;