import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useWalletStore = create((set, get) => ({
  walletBalance: 0,
  totalEarnings: 0,
  pendingWithdrawal: 0,
  availableBalance: 0,
  withdrawalHistory: [],
  isLoading: false,
  isSubmitting: false,

  fetchWalletBalance: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/wallet/balance");
      set({
        walletBalance: res.data.walletBalance,
        totalEarnings: res.data.totalEarnings,
        pendingWithdrawal: res.data.pendingWithdrawal,
        availableBalance: res.data.availableBalance,
        isLoading: false,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch wallet balance");
      set({ isLoading: false });
    }
  },

  fetchWithdrawalHistory: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/wallet/history");
      set({ withdrawalHistory: res.data, isLoading: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch withdrawal history");
      set({ isLoading: false });
    }
  },

  requestWithdrawal: async (data) => {
    set({ isSubmitting: true });
    try {
      const res = await axiosInstance.post("/wallet/withdraw", data);
      toast.success("Withdrawal request submitted successfully!");

      await get().fetchWalletBalance();
      await get().fetchWithdrawalHistory();

      set({ isSubmitting: false });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit withdrawal request");
      set({ isSubmitting: false });
      throw error;
    }
  },

  cancelWithdrawal: async (id) => {
    try {
      await axiosInstance.patch(`/wallet/cancel/${id}`);
      toast.success("Withdrawal cancelled successfully");

      await get().fetchWalletBalance();
      await get().fetchWithdrawalHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel withdrawal");
      throw error;
    }
  },
}));
