import express from "express"
import {
    changePassword,
    forgotPassword,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword
} from "../controllers/auth.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";

const router = express.Router()



// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/forgot-password", forgotPassword)
router.put("/reset-password/:token", resetPassword)


// Protected Routes
router.post("/logout", authentication, logoutUser);
router.put("/change-password", authentication, changePassword)


export default router