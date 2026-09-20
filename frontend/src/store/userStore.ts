import { create } from 'zustand';

import { getAllUsers } from '@/api/user.api';
import type { IUserResponse } from '@/types/user.types';

interface UserState {
  users: IUserResponse[];
  isLoading: boolean;
  error: string | null;

  fetchUsers: (force?: boolean) => Promise<void>;
  getUserName: (id?: string | null) => string;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async (force = false) => {
    if (!force && get().users.length > 0) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const users = await getAllUsers();
      set({ users, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch users';
      set({ error: message, isLoading: false });
    }
  },

  getUserName: (id?: string | null) => {
    if (!id) return 'Unassigned';
    const found = get().users.find((u) => u.id === id);
    return found ? found.name : 'Unassigned';
  },
}));
