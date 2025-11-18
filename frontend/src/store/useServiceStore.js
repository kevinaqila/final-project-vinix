import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

export const useServiceStore = create((set, get) => ({
  services: [],
  myServices: [],
  selectedService: null,
  isLoading: false,
  error: null,

  fetchServices: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category && filters.category !== 'Semua') params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const res = await axiosInstance.get(`/services?${params.toString()}`);
      set({ services: res.data.services, isLoading: false });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch services', isLoading: false });
      throw error;
    }
  },

  fetchServiceById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/services/${id}`);
      set({ selectedService: res.data.service, isLoading: false });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch service', isLoading: false });
      throw error;
    }
  },

  fetchMyServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get('/services/my/services');
      set({ myServices: res.data.services, isLoading: false });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch services', isLoading: false });
      throw error;
    }
  },

  fetchServicesByFreelancer: async (freelancerId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/services?freelancerId=${freelancerId}`);
      set({ services: res.data.services, isLoading: false });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch services', isLoading: false });
      throw error;
    }
  },

  createService: async (serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post('/services', serviceData);
      set({
        myServices: [res.data.service, ...get().myServices],
        isLoading: false,
      });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create service', isLoading: false });
      throw error;
    }
  },

  updateService: async (id, serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put(`/services/${id}`, serviceData);
      set({
        myServices: get().myServices.map((s) => (s._id === id ? res.data.service : s)),
        isLoading: false,
      });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update service', isLoading: false });
      throw error;
    }
  },

  deleteService: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/services/${id}`);
      set({
        myServices: get().myServices.filter((s) => s._id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete service', isLoading: false });
      throw error;
    }
  },

  clearSelectedService: () => set({ selectedService: null }),
}));
