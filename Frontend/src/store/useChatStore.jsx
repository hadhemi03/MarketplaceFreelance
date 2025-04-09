import { create } from "zustand";
import { toast } from "react-hot-toast";

export const useChatStore = create((set) => ({
  users: [
    { _id: "1", fullName: "John Doe", profilePic: "/avatar1.png" },
    { _id: "2", fullName: "Jane Smith", profilePic: "/avatar2.png" },
    { _id: "3", fullName: "Sarah Lee", profilePic: "/avatar3.png" },
  ],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  setSelectedUser: (selectedUser) => set({ selectedUser }),
  getUsers: () => {
    set({ isUsersLoading: false });
  },
}));
