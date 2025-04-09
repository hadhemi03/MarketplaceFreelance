// controllers/message.controller.js

import User from "../models/User.model.js";
import Message from "../models/Message.model.js";
import multer from "multer";
import path from "path";
import { getReceiverSocketId, io } from "../utils/socket.js";

// Configuration de stockage pour les images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Dossier où stocker les images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renommer l'image avec un timestamp
  },
});

const upload = multer({ storage: storage });

// Get all users for the sidebar
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Send message with an optional image using Multer
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`; // Image URL
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      image: imageUrl, // Set image URL if file is uploaded
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Middleware to handle image upload with multer
export const uploadMessageImage = upload.single("image");


export const startConversation = async (req, res) => { 
  const { freelancerId } = req.params;
  const { message } = req.body;

  try {
    const newConversation = new Message({
      senderId: req.user.id,
      receiverId: freelancerId,
      messages: [{ senderId: req.user.id, message }],
    });

    await newConversation.save();
    res.status(201).json(newConversation.messages[0]);  // Send back the first message
  } catch (error) {
    console.error(error);
    res.status(500).send('Error starting conversation');
  }

};