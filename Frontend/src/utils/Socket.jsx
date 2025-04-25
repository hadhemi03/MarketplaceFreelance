import { io } from "socket.io-client";

let socket = null;

export const initSocket = (token = null) => {
  socket = io('http://localhost:5000', {
    transports: ['websocket'],
    auth: token ? { token } : {}, // send token if needed
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};