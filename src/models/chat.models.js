import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "ai"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        default: "New Chat",
    },
    messages: [messageSchema],
}, { timestamps: true });

export const Chat = mongoose.model("Chat", chatSchema);