import { Chat } from "../models/chat.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getGeminiResponse } from "../utils/gemini.js";



export const sendMessage = asyncHandler(async (req, res) => {
    const { message, chatId } = req.body;
    const userId = req.user._id;

    let chat;

    if (chatId) {
        chat = await Chat.findOne({ _id: chatId, userId });
    }

    if (!chat) {
        chat = await Chat.create({
            userId,
            title: message.substring(0, 30),
            messages: [],
        });
    }

    chat.messages.push({ role: "user", content: message });

    const aiReply = await getGeminiResponse(chat.messages);

    chat.messages.push({ role: "ai", content: aiReply });

    await chat.save();

    res.json({
        chatId: chat._id,
        reply: aiReply,
    });
});


export const getUserChats = asyncHandler(async (req, res) => {
    const chats = await Chat.find({ userId: req.user._id })
        .sort({ updatedAt: -1 })
        .select("_id title updatedAt");

    res.json(chats);
});


export const getSingleChat = asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({
        _id: req.params.id,
        userId: req.user._id,
    });

    res.json(chat);
});
