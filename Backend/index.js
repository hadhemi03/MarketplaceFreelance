import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import projectRoute from "./routes/project.route.js";
import userRoute from "./routes/user.route.js";
import commentRoute from "./routes/comment.route.js";
import messageRoute from "./routes/message.route.js";
import chatRoute from "./routes/chat.route.js";
import offerRoute from "./routes/offer.route.js";
import ratingRoute from "./routes/rating.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
dotenv.config();

// Create the HTTP server to use with socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend requests
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Middlewares
app.use(cors({
  origin: "http://localhost:3000", // Allow frontend requests
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true, // Allow sending cookies (if needed)
}));
app.use(cookieParser());
app.use(express.json());

mongoose.connect(process.env.DB)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Serve static files from 'uploads' folder
app.use("/uploads", express.static("uploads"));  // Allow access to the 'uploads' folder

// Routes
app.use("/api/auth", authRoute);
app.use("/api/projects", projectRoute);
app.use("/api/comments", commentRoute);
app.use("/api/messages", messageRoute);
app.use("/api/chats", chatRoute);
app.use("/api/offers", offerRoute);
app.use("/api/ratings", ratingRoute);
app.use("/api/users", userRoute);

// Socket.io connections
let users = []; // Array to hold connected users

// Function to add user to the list of connected users
const addUser = (userId, socketId) => {
  if (!users.some(user => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

// Function to remove user from the list when they disconnect
const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
};

// Function to get a user by userId
const getUser = (userId) => {
  return users.find(user => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected");

  // Listen for user login and store socket ID
  socket.on("login", (userId) => {
    const existingUser = getUser(userId);
    if (!existingUser) {
      addUser(userId, socket.id);
    } else {
      // Update socketId if reconnecting
      existingUser.socketId = socket.id;
    }
    console.log(`User with id ${userId} connected`);
  });

  // Listen for sending messages
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    // Emit message to the receiver
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("receiveMessage", {
        senderId,
        text,
        createdAt: new Date(),
      });
    }
  });

  // Remove user from the users array when they disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
  });
});

// Start server
server.listen(process.env.PORT, () => {
  console.log("Server running on http://localhost:" + process.env.PORT);
});
