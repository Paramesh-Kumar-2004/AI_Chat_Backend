import express from "express";
import {
    sendMessage,
    getUserChats,
    getSingleChat,
} from "../controllers/chat.controllers.js";
import { authentication } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authentication, getUserChats);
router.get("/:id", authentication, getSingleChat);
router.post("/send", authentication, sendMessage);

export default router;
