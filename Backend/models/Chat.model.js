import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    lastMessage: {
        type: String
    },
    unreadMessages: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

export default mongoose.model("Chat", ChatSchema);
