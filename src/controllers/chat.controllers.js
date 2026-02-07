import asyncHandler from "../utils/asyncHandler.js";
import Chat from "../models/chat.models.js";
import { getGeminiResponse } from "../utils/gemini.js";



export const sendMessage = asyncHandler(async (req, res) => {
    console.log("Entered Into Send Message")

    const { message } = req.body;
    const userId = req.user._id;

    let chat = await Chat.findOne({ user: userId });

    if (!chat) {
        chat = await Chat.create({
            user: userId,
            messages: [],
        });
    }

    // Save user message
    chat.messages.push({ role: "user", content: message });

    // AI response
    const aiReply = await getGeminiResponse(message);

    chat.messages.push({ role: "ai", content: aiReply });
    await chat.save();

    res.status(200).json({
        success: true,
        reply: aiReply,
        history: chat.messages,
    });
});


export const getUserChats = asyncHandler(async (req, res) => {
    const chats = await Chat.find({ user: req.user.id })
        .select("title updatedAt")
        .sort({ updatedAt: -1 });

    res.json(chats);
});


export const getChatById = asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({
        _id: req.params.id,
        user: req.user.id,
    });

    if (!chat) throw new Error("Chat not found");

    res.json(chat);
});