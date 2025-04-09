import { create } from "zustand";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Fetch users for chat
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await fetch("/messages/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add any other necessary headers like Authorization
        },
      });
      const data = await res.json();
      set({ users: data });
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch messages for a selected user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await fetch(`/messages/msg/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set({ messages: data });
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send message
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await fetch(`/messages/send/${selectedUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });
      const data = await res.json();
      set({ messages: [...messages, data] });
    } catch (error) {
      toast.error("Failed to send message");
    }
  },

  // Subscribe to new messages
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = io(BASE_URL, {
      query: {
        userId: JSON.parse(localStorage.getItem("currentUser"))._id,  // Using localStorage for userId
      },
    });

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  // Unsubscribe from messages
  unsubscribeFromMessages: () => {
    const socket = io(BASE_URL);
    socket.off("newMessage");
  },

  // Set selected user for chat
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
