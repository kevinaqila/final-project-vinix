import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

export const useReviewStore = create((set, get) => ({
  reviews: [],
  isLoading: false,
  error: null,

  createReview: async (reviewData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post('/reviews', reviewData);
      set({ isLoading: false });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create review', isLoading: false });
      throw error;
    }
  },

  fetchServiceReviews: async (serviceId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/reviews/service/${serviceId}`);
      set({ reviews: res.data.reviews, isLoading: false });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch reviews', isLoading: false });
      throw error;
    }
  },

  fetchReviewsByFreelancer: async (freelancerId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/reviews/freelancer/${freelancerId}`);
      set({ reviews: res.data.reviews, isLoading: false });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch reviews', isLoading: false });
      throw error;
    }
  },

  respondToReview: async (reviewId, response) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put(`/reviews/${reviewId}/respond`, { response });
      set({
        reviews: get().reviews.map((r) => (r._id === reviewId ? res.data.review : r)),
        isLoading: false,
      });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to respond to review', isLoading: false });
      throw error;
    }
  },
}));
