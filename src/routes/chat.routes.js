import express from "express";
import {
    sendMessage,
    getUserChats,
    getChatById,
} from "../controllers/chat.controllers.js";
import { authentication } from "../middlewares/auth.middleware.js";

const router = express.Router();



router.post("/send", authentication, sendMessage);
router.get("/", authentication, getUserChats);
router.get("/:id", authentication, getChatById);

export default router;
