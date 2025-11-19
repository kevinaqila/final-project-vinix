import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/api/auth/signup", data);
      localStorage.setItem("token", res.data.token);
      await get().checkAuth();
      toast.success("Akun berhasil dibuat!");
    } catch (error) {
      const msg = error.response?.data?.message || "Gagal membuat akun. Silakan coba lagi.";
      toast.error(msg);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data, navigate) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/api/auth/login", data);

      if (!res.data.user) {
        throw new Error("Login response missing user data");
      }

      localStorage.setItem("token", res.data.token);
      set({ authUser: res.data.user });
      toast.success("Login berhasil!");

      // Role check with debug
      setTimeout(() => {
        const userRole = res.data.user?.role;

        if (userRole && userRole !== "" && userRole !== null) {
          navigate(`/${userRole}/dashboard`);
        } else {
          navigate("/select-role");
        }
      }, 100);
    } catch (error) {
      const msg = error.response?.data?.message || "Email atau password salah.";
      toast.error(msg);
    } finally {
      set({ isLoggingIn: false });
      console.log("🏁 Login process finished");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ authUser: null });
    toast.success("Logout berhasil!");
  },

  checkAuth: async (navigate) => {
    set({ isCheckingAuth: true });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ authUser: null, isCheckingAuth: false });
        return;
      }

      const res = await axiosInstance.get("/api/auth/verify");
      const user = res.data.user;
      set({ authUser: res.data.user });

      if (user?.role && user.role !== "" && user.role !== null) {
        if (user.isProfileComplete) {
          navigate(`/${user.role}/dashboard`);
        } else {
          navigate(`/${user.role}/onboarding`);
        }
      } else {
        navigate("/select-role");
      }
    } catch (error) {
      console.error("Auth check error:", error);

      set({ authUser: null });
      localStorage.removeItem("token");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  selectRole: async (role) => {
    try {
      const res = await axiosInstance.put("/api/user/select-role", { role });
      set({ authUser: res.data.user });
      toast.success("Role berhasil dipilih!");
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Gagal memilih role";
      toast.error(msg);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    const res = await axiosInstance.put("/api/user/profile", profileData);
    set({ authUser: res.data.user });
    return res.data;
  },

  updateFreelancerProfile: async (profileData) => {
    const res = await axiosInstance.put("/api/user/freelancer-profile", profileData);
    set({ authUser: res.data.user });
    return res.data;
  },

  updateClientProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/api/user/client-profile", data);
      set({ authUser: res.data.user });
      toast.success("Profil client berhasil diperbarui!");
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Gagal memperbarui profil client";
      toast.error(msg);
      throw error;
    }
  },

  uploadProfilePhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await axiosInstance.post("/api/user/upload-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({ authUser: res.data.user });
      toast.success("Foto profil berhasil diupload!");
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Gagal upload foto profil";
      toast.error(msg);
      throw error;
    }
  },
}));
