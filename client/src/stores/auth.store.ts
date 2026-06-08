import { create } from "zustand";
import type { PublicUser } from "@/types/user";

interface AuthStore {
  user: PublicUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: PublicUser | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user, isLoading: false }),

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  refreshUser: async (retries = 3) => {
    set({ isLoading: true });
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          set({ user: data.user, isAuthenticated: true, isLoading: false });
          return;
        }
        if (res.status !== 401) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
      } catch {
        if (i < retries - 1) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
      }
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
