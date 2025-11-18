import axios from 'axios';
import toast from 'react-hot-toast';

let lastToastTime = 0;
const TOAST_COOLDOWN = 3000;

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';
const cleanBaseURL = API_BASE_URL.replace(/\/+$/, '');

export const axiosInstance = axios.create({
  baseURL: cleanBaseURL,
  timeout: 10000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (config.url.startsWith('/')) {
    config.url = config.url.substring(1);
  }
  return config;
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const now = Date.now();

    if (now - lastToastTime < TOAST_COOLDOWN) {
      return Promise.reject(error);
    }

    lastToastTime = now;

    let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          errorMessage = data.message || 'Data yang dimasukkan tidak valid.';
          break;
        case 401:
          errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          errorMessage = 'Anda tidak memiliki akses untuk melakukan tindakan ini.';
          break;
        case 404:
          errorMessage = 'Data atau halaman yang dicari tidak ditemukan.';
          break;
        case 409:
          errorMessage = 'Data sudah ada atau terjadi konflik.';
          break;
        case 422:
          errorMessage = 'Format data tidak sesuai.';
          break;
        case 429:
          errorMessage = 'Terlalu banyak permintaan. Silakan tunggu sebentar.';
          break;
        case 500:
          errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
          break;
        default:
          errorMessage = data.message || 'Terjadi kesalahan yang tidak diketahui.';
      }
    } else if (error.request) {
      errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    } else {
      errorMessage = 'Terjadi kesalahan dalam memproses permintaan.';
    }

    toast.error(errorMessage);

    return Promise.reject(error);
  }
);