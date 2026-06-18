import { create } from 'zustand';

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

  // Actions
  setIsOnboarded: (value: boolean) => void;
  setIsAuthenticated: (value: boolean) => void;
  setUserRole: (role: UserRole) => void;
  setUser: (user: UserData) => void;

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
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  // Individual setters
  setIsOnboarded: (value: boolean) => set({ isOnboarded: value }),

  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),

  setUserRole: (role: UserRole) => set({ userRole: role }),

  setUser: (user: UserData) => set({ user }),

  // Combined actions
  completeOnboarding: (role: UserRole) =>
    set({
      isOnboarded: true,
      userRole: role,
    }),

  login: (role: UserRole, user?: UserData) =>
    set({
      isAuthenticated: true,
      userRole: role,
      user: user ?? null,
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      userRole: null,
      user: null,
    }),

  reset: () => set(initialState),
}));