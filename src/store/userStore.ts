import { create } from "zustand";

type UserRole = "USER" | "ORGANIZATION" | null;

interface AppStore {
  isOnboarded: boolean;
  isAuthenticated: boolean;
  userRole: UserRole;

  setOnboarded: (value: boolean) => void;
  setAuthenticated: (value: boolean) => void;
  setUserRole: (role: UserRole) => void;

  logout: () => void;
  reset: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isOnboarded: false,
  isAuthenticated: false,
  userRole: null,

  setOnboarded: (value) =>
    set({
      isOnboarded: value,
    }),

  setAuthenticated: (value) =>
    set({
      isAuthenticated: value,
    }),

  setUserRole: (role) =>
    set({
      userRole: role,
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      userRole: null,
    }),

  reset: () =>
    set({
      isOnboarded: false,
      isAuthenticated: false,
      userRole: null,
    }),
}));
