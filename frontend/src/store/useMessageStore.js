import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useMessageStore = create((set, get) => ({
  conversations: [],
  messages: [],
  selectedOrderId: null,
  unreadCount: 0,
  isLoading: false,
  isInitialLoad: true,
  isSending: false,

  fetchConversations: async (showLoading = true) => {
    if (showLoading) set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/messages/conversations");
      set({ conversations: res.data, isLoading: false, isInitialLoad: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch conversations");
      set({ isLoading: false });
    }
  },

  fetchMessages: async (orderId, showLoading = true) => {
    if (showLoading) set({ isLoading: true, selectedOrderId: orderId });
    try {
      const res = await axiosInstance.get(`/messages/${orderId}`);
      set({ messages: res.data, isLoading: false, isInitialLoad: false });

      await get().fetchUnreadCount();
    } catch (error) {
      if (showLoading) toast.error(error.response?.data?.message || "Failed to fetch messages");
      set({ isLoading: false });
    }
  },

  sendMessage: async (orderId, messageData) => {
    set({ isSending: true });
    try {
      const res = await axiosInstance.post(`/messages/${orderId}`, messageData);

      set((state) => ({
        messages: [...state.messages, res.data],
        isSending: false,
      }));

      await get().fetchConversations();

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      set({ isSending: false });
      throw error;
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await axiosInstance.get("/messages/unread-count");
      set({ unreadCount: res.data.unreadCount });
    } catch {
      // Silent error - non-critical feature
    }
  },

  clearSelectedConversation: () => {
    set({ selectedOrderId: null, messages: [] });
  },
}));
