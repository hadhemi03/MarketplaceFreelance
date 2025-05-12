import Message from "../models/message.model.js";
import Notification from "../models/Notification.model.js";
import User from "../models/User.model.js";
import Chat from "../models/Chat.model.js";
import mongoose from "mongoose";


// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, text } = req.body;

        const io = req.app.get('io');
        const users = req.app.get('users');

        if (!senderId || !receiverId || !text) {
            return res.status(400).json({ message: "Missing fields" });
        }

        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: "Invalid sender or receiver ID" });
        }

        let chat = await Chat.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!chat) {
            chat = new Chat({
                participants: [senderId, receiverId]
            });
            await chat.save();
        }

        const message = new Message({
            chatId: chat._id,
            senderId,
            receiverId,
            text
        });

        await message.save();

        const newNotif = await Notification.create({
            userId: receiverId,
            type: "new_message",
            message: "You have received a new message.",
            projectId: chat._id,
        });

        // Emit notification in real-time
        const receiver = users.find(user => user.userId === receiverId);
        console.log("Connected users:", users);
        if (receiver && io) {
            io.to(receiver.socketId).emit("newNotification", {
                _id: newNotif._id,
                userId: newNotif.userId,
                type: newNotif.type,
                message: newNotif.message,
                projectId: newNotif.projectId,
                createdAt: newNotif.createdAt,
            });
        }

        // Emit to all sockets of that user (you need a mapping if using multiple devices)
        if (io) {
            io.emit("receiveMessage", {
                senderId,
                text,
                createdAt: new Date(),
            });
        }

        return res.status(200).json(message);
    } catch (err) {
        console.error("Error sending message:", err);
        return res.status(500).json({ message: "Error sending message" });
    }
};

// Get messages for a specific chat
export const getMessages = async (req, res, next) => {
    try {
        const currentUserId = req.user._id;
        const otherUserId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: currentUserId },
            ]
        }).sort({ createdAt: 1 });

        return res.status(200).json(messages);
    } catch (err) {
        return next(err);
    }
};

