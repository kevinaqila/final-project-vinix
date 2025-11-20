import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

export const useOrderStore = create((set, get) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,

  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post('/api/orders', orderData);
      set({ isLoading: false });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create order', isLoading: false });
      throw error;
    }
  },

  fetchMyOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get('/api/orders/my-orders');
      set({ orders: res.data.orders, isLoading: false });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch orders', isLoading: false });
      throw error;
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/api/orders/${id}`);
      set({ selectedOrder: res.data.order, isLoading: false });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch order', isLoading: false });
      throw error;
    }
  },

  acceptOrder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put(`/api/orders/${id}/accept`);
      set({
        selectedOrder: res.data.order,
        orders: get().orders.map((o) => (o._id === id ? res.data.order : o)),
        isLoading: false,
      });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to accept order', isLoading: false });
      throw error;
    }
  },

  submitWork: async (id, submitData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put(`/api/orders/${id}/submit`, submitData || {});
      set({
        selectedOrder: res.data.order,
        orders: get().orders.map((o) => (o._id === id ? res.data.order : o)),
        isLoading: false,
      });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to submit work', isLoading: false });
      throw error;
    }
  },

  requestRevision: async (id, revisionData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put(`/api/orders/${id}/revision`, revisionData);
      set({
        selectedOrder: res.data.order,
        orders: get().orders.map((o) => (o._id === id ? res.data.order : o)),
        isLoading: false,
      });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to request revision', isLoading: false });
      throw error;
    }
  },

  approveOrder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put(`/api/orders/${id}/approve`);
      set({
        selectedOrder: res.data.order,
        orders: get().orders.map((o) => (o._id === id ? res.data.order : o)),
        isLoading: false,
      });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to approve order', isLoading: false });
      throw error;
    }
  },

  uploadOrderFiles: async (id, files) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const res = await axiosInstance.post(`/api/orders/${id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set({ selectedOrder: res.data.order, isLoading: false });
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload files';
      set({ error: errorMessage, isLoading: false });
      // Don't throw error to prevent double toast from axios interceptor
      return { error: errorMessage };
    }
  },

  clearSelectedOrder: () => set({ selectedOrder: null }),
}));
