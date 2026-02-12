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
},
    { timestamps: true }
);

const chatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    messages: [messageSchema],
},
    { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);