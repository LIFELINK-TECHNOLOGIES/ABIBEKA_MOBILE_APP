import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import api from "../../clients";
import { useAuthStore } from "../../../store/authStore";

// ─── Types ─────────────────────────────────────────────────────────────────
interface RegisterPayload {
  role?: "EMPLOYEE" | "ORGANIZATION";
  fullName?: string;
  email: string;
  password: string;
  organization?: string;
  cacNumber?: string;
  location?: string;
  employeeRange?: string;
  businessSector?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "EMPLOYEE" | "ORGANIZATION";
  organization: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

// ─── Helper: map backend role to store's UserRole ────────────────────────
const mapRole = (role: AuthUser["role"]): "employee" | "organization" =>
  role === "ORGANIZATION" ? "organization" : "employee";

// ─── Register ──────────────────────────────────────────────────────────────
export const useRegister = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post<AuthResponse>("/auth/register", payload);
      return data;
    },
    onSuccess: async (data) => {
      await SecureStore.setItemAsync("token", data.token);
      login(mapRole(data.user.role));
    },
  });
};

// ─── Login ─────────────────────────────────────────────────────────────────
export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<AuthResponse>("/auth/login", payload);
      return data;
    },
    onSuccess: async (data) => {
      await SecureStore.setItemAsync("token", data.token);
      login(mapRole(data.user.role));
    },
  });
};