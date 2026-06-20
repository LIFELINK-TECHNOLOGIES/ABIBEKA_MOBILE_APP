import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { queryClient } from "../utils/queryClient"

type UserRole = 'employee' | 'organization' | null;

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: 'EMPLOYEE' | 'ORGANIZATION';
  organization: string;
  cacNumber: string;
  location: string;
  employeeRange: string;
  businessSector: string;
  organizationId: string | null;
  joinedOrganizationName: string | null;
  position: string;
  department: string;
  clearanceLevel: string;
}

interface AuthState {
  isOnboarded: boolean;
  isAuthenticated: boolean;
  userRole: UserRole;
  user: UserData | null;
  hasHydrated: boolean; // true once SecureStore has finished loading on app start

  // Actions
  setIsOnboarded: (value: boolean) => void;
  setIsAuthenticated: (value: boolean) => void;
  setUserRole: (role: UserRole) => void;
  setUser: (user: UserData) => void;
  setHasHydrated: (value: boolean) => void;

  // Combined actions for common scenarios
  completeOnboarding: (role: UserRole) => void;
  login: (role: UserRole, user?: UserData) => void;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  isOnboarded: false,
  isAuthenticated: false,
  userRole: null as UserRole,
  user: null as UserData | null,
  hasHydrated: false,
};

// Adapts expo-secure-store's API to the shape zustand/persist expects
const secureStorage: StateStorage = {
  getItem: async (name) => {
    return (await SecureStore.getItemAsync(name)) ?? null;
  },
  setItem: async (name, value) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name) => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      setIsOnboarded: (value) => set({ isOnboarded: value }),
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setUserRole: (role) => set({ userRole: role }),
      setUser: (user) => set({ user }),
      setHasHydrated: (value) => set({ hasHydrated: value }),

      completeOnboarding: (role) =>
        set({
          isOnboarded: true,
          userRole: role,
        }),

      login: (role, user) =>
        set({
          isAuthenticated: true,
          userRole: role,
          user: user ?? null,
        }),

      logout: () => {
        // Wipe every cached server response (mood entries, dashboard, etc.)
        // so the next user on this device never sees stale data, and this
        // user never sees a flash of stale data if they log back in fast.
        queryClient.clear();

        set({
          isAuthenticated: false,
          userRole: null,
          user: null,
        });
      },

      reset: () => {
        queryClient.clear();
        set(initialState);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      // Don't persist hasHydrated itself
      partialize: (state) => ({
        isOnboarded: state.isOnboarded,
        isAuthenticated: state.isAuthenticated,
        userRole: state.userRole,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);