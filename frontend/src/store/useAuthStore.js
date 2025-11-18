import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/api/auth/signup', data);
      localStorage.setItem('token', res.data.token);
      await get().checkAuth();
      toast.success('Akun berhasil dibuat!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal membuat akun. Silakan coba lagi.';
      toast.error(msg);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
  console.log('🚀 Starting login process...');
  set({ isLoggingIn: true });
  
  try {
    console.log('📤 Sending login request:', data);
    const res = await axiosInstance.post('/api/auth/login', data);
    
    console.log('📥 Login response status:', res.status);
    console.log('📥 Login response data:', res.data);
    console.log('🔑 Token in response:', !!res.data.token);
    console.log('👤 User in response:', res.data.user);
    
    if (!res.data.user) {
      console.error('❌ No user data in response!');
      throw new Error('Login response missing user data');
    }
    
    localStorage.setItem('token', res.data.token);
    console.log('💾 Token saved to localStorage');
    
    set({ authUser: res.data.user });
    console.log('🔄 authUser set in state');
    
    toast.success('Login berhasil!');
    console.log('✅ Success toast shown');
    
    // Role check with debug
    setTimeout(() => {
      const userRole = res.data.user?.role;
      console.log('🎭 Checking role:', userRole);
      
      if (userRole && userRole !== '' && userRole !== null) {
        console.log('📍 Redirecting to dashboard');
        window.location.href = `/${userRole}/dashboard`; 
      } else {
        console.log('📍 Redirecting to select-role');
        window.location.href = '/select-role';
      }
    }, 100);
    
  } catch (error) {
    console.error('❌ Login error caught:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    
    const msg = error.response?.data?.message || 'Email atau password salah.';
    toast.error(msg);
  } finally {
    set({ isLoggingIn: false });
    console.log('🏁 Login process finished');
  }
},

  logout: () => {
    localStorage.removeItem('token');
    set({ authUser: null });
    toast.success('Logout berhasil!');
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ authUser: null, isCheckingAuth: false });
        return;
      }

      const res = await axiosInstance.get('/api/auth/verify');
      set({ authUser: res.data.user });
    } catch (error) {
            console.error('Auth check error:', error);

      set({ authUser: null });
          localStorage.removeItem('token');

    } finally {
      set({ isCheckingAuth: false });
    }
  },

  selectRole: async (role) => {
   try {
      const res = await axiosInstance.put('/api/user/select-role', { role });
      set({ authUser: res.data.user });
      toast.success('Role berhasil dipilih!');
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal memilih role';
      toast.error(msg);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    const res = await axiosInstance.put('/api/user/profile', profileData);
    set({ authUser: res.data.user });
    return res.data;
  },

  updateFreelancerProfile: async (profileData) => {
    const res = await axiosInstance.put('/api/user/freelancer-profile', profileData);
    set({ authUser: res.data.user });
    return res.data;
  },

  uploadProfilePhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const res = await axiosInstance.post('/api/user/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      set({ authUser: res.data.user });
      toast.success('Foto profil berhasil diupload!');
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal upload foto profil';
      toast.error(msg);
      throw error;
    }
  },
}));
