import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../store/authStore"; 

const BASE_URL = "http://192.168.43.175:5000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor — attach token to every request ─────────────────
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — handle expired/invalid tokens globally ───────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("token");
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;