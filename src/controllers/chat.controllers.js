import asyncHandler from "../utils/asyncHandler.js";
import Chat from "../models/chat.models.js";
import openai from "../config/openai.js";



export const sendMessage = asyncHandler(async (req, res) => {
    const { message, chatId } = req.body;
    const userId = req.user.id;

    let chat;

    if (chatId) {
        chat = await Chat.findOne({ _id: chatId, user: userId });
        if (!chat) throw new Error("Chat not found");
    } else {
        chat = await Chat.create({
            user: userId,
            messages: [],
        });
    }

    chat.messages.push({ role: "user", content: message });

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: chat.messages,
    });

    const aiReply = completion.choices[0].message.content;

    chat.messages.push({ role: "assistant", content: aiReply });

    await chat.save();

    res.status(200).json({
        chatId: chat._id,
        reply: aiReply,
        messages: chat.messages,
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