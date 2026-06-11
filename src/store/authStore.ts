// stores/authStore.ts
import { create } from 'zustand';

type UserRole = 'employee' | 'organization' | null;

interface AuthState {
  isOnboarded: boolean;
  isAuthenticated: boolean;
  userRole: UserRole;
  
  // Actions
  setIsOnboarded: (value: boolean) => void;
  setIsAuthenticated: (value: boolean) => void;
  setUserRole: (role: UserRole) => void;
  
  // Combined actions for common scenarios
  completeOnboarding: (role: UserRole) => void;
  login: (role: UserRole) => void;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  isOnboarded: false,
  isAuthenticated: false,
  userRole: null as UserRole,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  
  // Individual setters
  setIsOnboarded: (value: boolean) => set({ isOnboarded: value }),
  
  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  
  setUserRole: (role: UserRole) => set({ userRole: role }),
  
  // Combined actions
  completeOnboarding: (role: UserRole) => 
    set({ 
      isOnboarded: true, 
      userRole: role 
    }),
  
  login: (role: UserRole) => 
    set({ 
      isAuthenticated: true, 
      userRole: role 
    }),
  
  logout: () => 
    set({ 
      isAuthenticated: false, 
      userRole: null 
    }),
  
  reset: () => set(initialState),
}));