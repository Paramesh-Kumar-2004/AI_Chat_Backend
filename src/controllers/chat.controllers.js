import asyncHandler from "../utils/asyncHandler.js";
import Chat from "../models/chat.models.js";
import { getGeminiResponse } from "../utils/gemini.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";



const createChat = asyncHandler(async (req, res) => {
    console.log("Entered Into Create Chat")
    const { chatName } = req.body;
    const user = req.user._id

    const exUser = await User.findById(user)
    if (!exUser) {
        throw new ApiError(404, "User Not Found")
    }

    const chat = await Chat.create({ chatName, user })

    res.status(200).json({
        message: "New Chat Created Successfully"
    })
})


const editChatName = asyncHandler(async (req, res) => {
    console.log("Entered Into Get Chats")
    const { chatId } = req.params
    const { chatName } = req.body

    const chat = await Chat.findByIdAndUpdate(
        chatId,
        { chatName },
        { new: true }
    )

    if (!chat) {
        throw new ApiError(404, "Chat Not Found")
    }

    res.status(200).json({
        message: "Chats Fetched Successfully",
        chat
    })
})


const sendMessage = asyncHandler(async (req, res) => {
    console.log("Entered Into Send Message")

    const { message } = req.body
    const id = req.params.chatId

    if (!message || !message.trim()) {
        res.status(400)
        throw new Error("Message is required")
    }

    let chat = await Chat.findById(id)

    if (!chat) {
        chat = await Chat.create({
            chatName: "System Created",
            user: req.user._id,
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


const getUserChats = asyncHandler(async (req, res) => {
    const chats = await Chat.find({ user: req.user.id })
        .select({
            "chatName": 1,
            "messages.role": 1,
            "messages.content": 1,
        })
        .sort({ updatedAt: -1 });

    res.status(200).json({
        chats,
    })
});


const getChatById = asyncHandler(async (req, res) => {
    const { chatId } = req.params

    const chat = await Chat.findById(chatId).select({
        "chatName":1,
        "messages.role": 1,
        "messages.content": 1,
    })

    res.status(200).json({
        message: "Chat Fetched Successfully",
        chat
    })
});


const deleteChat = asyncHandler(async (req, res) => {
    console.log("Entered Into Delete Chat")
    const { chatId } = req.params

    const deleteExChat = await Chat.findByIdAndDelete(chatId)
    if (!deleteExChat) {
        throw new ApiError(404, "Chat Not Found")
    }

    res.status(200).json({
        message: "Chat Deleted Successfully"
    })
})


export {
    createChat,
    editChatName,
    sendMessage,
    getUserChats,
    getChatById,
    deleteChat
}