import { create } from 'zustand';
import { io } from 'socket.io-client';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  socket: null,
  setUser: (user) => set(() => ({ user })),
  initializeSocket: () =>
    set((state) => {
      if (!state.socket) {
        const socket = io("http://localhost:5000");
        socket.emit("addUser", state.user?._id);
        return { socket };
      }
      return {};
    }),
}));
