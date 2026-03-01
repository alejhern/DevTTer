"use client";
import type { User } from "@/types";

import { createContext, useEffect, useState, ReactNode } from "react";

import { onAuthStateChanged } from "@/firebase/user";

type UserContextType = {
  user?: User | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(setUser);

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}
