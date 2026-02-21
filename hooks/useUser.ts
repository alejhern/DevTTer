import type { User } from "@/types";

import { useState, useEffect } from "react";

import { onAuthStateChanged } from "@/firebase/user";

export function useUser(): User | null | undefined {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(setUser);

    return () => unsubscribe();
  }, []);

  return user;
}
