import asyncHandler from "../utils/asyncHandler.js";
import Chat from "../models/chat.models.js";
import { getGeminiResponse } from "../utils/gemini.js";



export const createChat = asyncHandler(async (req, res) => {
    console.log("Entered Into Create Chat")
    const { chatName } = req.body;
    const chat = await Chat.create({ chatName })

})


export const sendMessage = asyncHandler(async (req, res) => {
    console.log("Entered Into Send Message")

    const { message } = req.body
    const userId = req.user._id

    if (!message || !message.trim()) {
        res.status(400)
        throw new Error("Message is required")
    }

    let chat = await Chat.findOne({ user: userId })

    if (!chat) {
        chat = await Chat.create({
            user: userId,
            messages: []
        })
    }

    chat.messages.push({
        role: "user",
        content: message.trim()
    })

    let aiReply = ""
    try {
        aiReply = await getGeminiResponse(message)
    } catch (error) {
        console.error("Gemini Error:", error)
        aiReply = "Sorry, I couldn’t generate a response right now."
    }

    chat.messages.push({
        role: "ai",
        content: aiReply
    })

    await chat.save()

    res.status(200).json({
        success: true,
        messages: chat.messages
    })
})


export const getUserChats = asyncHandler(async (req, res) => {
    const chats = await Chat.find({ user: req.user.id })
        .select({
            "messages.role": 1,
            "messages.content": 1,
        })
        .sort({ updatedAt: -1 });

    res.status(200).json({
        chats,
    })
});


export const getChatById = asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({
        _id: req.params.id,
        user: req.user.id,
    });

    if (!chat) throw new Error("Chat not found");

    res.json(chat);
});