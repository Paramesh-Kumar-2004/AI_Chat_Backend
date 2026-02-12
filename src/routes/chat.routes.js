import express from "express";
import {
    sendMessage,
    getUserChats,
    getChatById,
    editChatName,
    createChat,
    deleteChat,
} from "../controllers/chat.controllers.js";
import { authentication } from "../middlewares/auth.middleware.js";

const router = express.Router();



router.post("/create", authentication, createChat);
router.post("/send/:chatId", authentication, sendMessage);
router.patch("/:chatId", authentication, editChatName);
router.get("/", authentication, getUserChats);
router.get("/:chatId", authentication, getChatById);
router.delete("/:chatId", authentication, deleteChat)

export default router;
