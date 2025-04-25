import { create } from 'zustand';

const useChatStore = create((set) => ({
  currentUserId: null,
  setCurrentUserId: (id) => set({ currentUserId: id }),
}));

export default useChatStore;
