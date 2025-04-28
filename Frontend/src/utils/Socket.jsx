import { io } from "socket.io-client";

let socket = null;

// Initialize the socket connection
export const initSocket = (token = null) => {
  if (socket) {
    return socket; // If already initialized, return the existing socket
  }

  socket = io('http://localhost:5000', {
    transports: ['websocket'],  // Force WebSocket transport
    auth: token ? { token } : {}, // Send token if available
    reconnection: true, // Enable reconnection attempts
    reconnectionAttempts: 5, // Try 5 times before giving up
    reconnectionDelay: 1000, // Delay of 1 second between reconnection attempts
    reconnectionDelayMax: 5000, // Max delay of 5 seconds between attempts
  });

  // Listen for connection errors
  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  return socket;
};

// Get the socket instance
export const getSocket = () => socket;

// Disconnect the socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
