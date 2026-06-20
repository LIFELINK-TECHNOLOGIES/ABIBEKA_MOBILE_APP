import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import api from "../../clients";
import { useAuthStore, UserData } from "../../../store/authStore";
import { writeCache, clearAllCache } from "../../offline/hooks/useOfflineCache";
import { PROFILE_KEYS } from "../../offline/hooks/useProfile";
import { useCallback } from "react";

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

interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserData;
}

const mapRole = (role: UserData["role"]): "employee" | "organization" =>
  role === "ORGANIZATION" ? "organization" : "employee";

export const useRegister = () => {
  const queryClient = useQueryClient();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post<AuthResponse>("/auth/register", payload);
      return data;
    },
    onSuccess: async (data) => {
      await SecureStore.setItemAsync("token", data.token);

      // Seed both stores from the login response immediately
      login(mapRole(data.user.role), data.user);

      // Seed React Query + AsyncStorage so profile screen is instant
      queryClient.setQueryData(PROFILE_KEYS.me, {
        success: true,
        data: data.user,
      });
      await writeCache("profile:me", data.user);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<AuthResponse>("/auth/login", payload);
      return data;
    },
    onSuccess: async (data) => {
      await SecureStore.setItemAsync("token", data.token);

      // 1. Zustand
      login(mapRole(data.user.role), data.user);

      // 2. React Query cache — profile screen uses this as initialData
      queryClient.setQueryData(PROFILE_KEYS.me, {
        success: true,
        data: data.user,
      });

      // 3. AsyncStorage — survives app restarts
      await writeCache("profile:me", data.user);
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);

  return useCallback(async () => {
    await SecureStore.deleteItemAsync("token");
    await clearAllCache(); // wipe AsyncStorage cache
    logout();             // clears RQ cache via queryClient.clear() in store
  }, [logout]);
};