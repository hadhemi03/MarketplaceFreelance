import Chat from "../models/Chat.model.js";
import Message from "../models/message.model.js";

// Create or get an existing chat between two users
export const createOrGetChat = async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    // Find if the chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [userId1, userId2] },
    });

    if (!chat) {
      // If no chat exists, create a new one
      chat = new Chat({
        participants: [userId1, userId2],
      });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error fetching or creating chat" });
  }
};

// Get all chats for a user (used in sidebar)
export const getUserChats = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch chats where userId is one of the participants
    const chats = await Chat.find({ participants: { $in: [userId] } })
      .populate("participants", "username img");  // Only populate username and img

    res.status(200).json(chats);
  } catch (err) {
    console.error("Error fetching user chats:", err);
    res.status(500).json({ message: "Error fetching user chats" });
  }
};

