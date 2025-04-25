// src/socket.js
import { io } from "socket.io-client";

// Connect to the backend Socket.io server
const socket = io("http://localhost:5000", {
  withCredentials: true,  // If you need to handle cookies (optional)
});

socket.on("connect", () => {
  console.log("Connected to socket server!");
});

export default socket;
