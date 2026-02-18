import type { User } from "../types";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: User | undefined;
  setUser: (user: User) => void;
  closeSession: () => void;
}

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user: User) => {
        set({ user });
      },
      closeSession: () => {
        set({ user: undefined });
      },
    }),
    {
      name: "user-storage",
    },
  ),
);
