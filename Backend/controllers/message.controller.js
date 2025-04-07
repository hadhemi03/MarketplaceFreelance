import Project from "../models/Project.model.js";
import User from "../models/User.model.js";
import Message from "../models/Message.model.js";


export const sendMessage = async (req, res) => {
    try {
        const { receiverId, projectId, message, role } = req.body;
        const senderId = req.user._id;

        const newMessage = await Message.create({
            senderId,
            receiverId,
            projectId,
            message,
            role,
        });

        res.status(201).json({ message: newMessage });
    } catch (err) {
        res.status(500).json({ error: "Failed to send message", details: err.message });
    }
};


export const getMessagesByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const messages = await Message.find({ projectId })
            .sort({ createdAt: 1 }) // Oldest to newest
            .populate("senderId", "fullName role")
            .populate("receiverId", "fullName role");

        res.status(200).json({ messages });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch messages", details: err.message });
    }
};


// Fetch all the project conversations for a user
export const getConversationsForUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        }).populate("projectId", "projectName");

        res.status(200).json({ conversations });
    } catch (err) {
        res.status(500).json({ error: "Failed to get conversations", details: err.message });
    }
};


export const markMessagesAsSeen = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user._id;

        await Message.updateMany(
            { receiverId: userId, projectId, seen: false },
            { $set: { seen: true } }
        );

        res.status(200).json({ message: "Messages marked as seen" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update seen status", details: err.message });
    }
};




