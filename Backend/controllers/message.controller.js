import Message from "../models/message.model.js";
import User from "../models/User.model.js";
import Chat from "../models/Chat.model.js";
import mongoose from "mongoose";


// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, text } = req.body;

        // Validate required fields
        if (!senderId || !receiverId || !text) {
            return res.status(400).json({ message: "Missing fields" });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: "Invalid sender or receiver ID" });
        }

        // Step 1: Check if a chat already exists between sender and receiver
        let chat = await Chat.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // Step 2: If no chat exists, create a new chat
        if (!chat) {
            chat = new Chat({
                participants: [senderId, receiverId]
            });
            await chat.save();
        }

        // Step 3: Create the message
        const message = new Message({
            chatId: chat._id,
            senderId,
            receiverId,
            text
        });

        await message.save();

        // Emit to the receiver's socket (if using Socket.io)
        if (typeof io !== "undefined") {
            io.to(receiverId).emit('new_message', message);
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
  
