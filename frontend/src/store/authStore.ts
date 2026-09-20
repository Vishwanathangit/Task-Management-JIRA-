import { create } from 'zustand';

import { getCurrentUser, loginUser, logoutUser, signupUser } from '@/api/auth.api';
import type { ILoginInput, ISignupInput, IUserResponse } from '@/types/user.types';

interface AuthState {
  user: IUserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  login: (input: ILoginInput) => Promise<void>;
  signup: (input: ISignupInput) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,

  login: async (input: ILoginInput) => {
    set({ isLoading: true });
    try {
      const user = await loginUser(input);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (input: ISignupInput) => {
    set({ isLoading: true });
    try {
      const user = await signupUser(input);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutUser();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const user = await getCurrentUser();
      set({ user, isAuthenticated: true, isCheckingAuth: false });
    } catch {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
