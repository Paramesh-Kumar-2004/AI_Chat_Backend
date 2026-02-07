import express from "express";
import {
    authentication,
    authorization
} from "../middlewares/auth.middleware.js";
import {
    updateMyProfile,
    deleteMyAccount,
    getMyProfile,
    findPlayers,
    getAllPlayers,
    getPlayerById,
} from "../controllers/user.controllers.js";


const router = express.Router()



// Protected Routes
router.get("/me", authentication, getMyProfile);
router.patch("/me", authentication, updateMyProfile);
router.get("/find-players", authentication, findPlayers)
router.delete("/me", authentication, deleteMyAccount);


// Super Admin , Admin , Manager Routes (RBAC)
router.get("/user/:userId",
    authentication, authorization(["admin", "superadmin", "manager"]), getPlayerById
)
router.get("/users",
    authentication, authorization(["superadmin", "admin", "manager"]),
    getAllPlayers
)

export default router