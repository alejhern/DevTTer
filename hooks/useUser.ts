import type { User } from "@/types";

import { useState, useEffect } from "react";

import { onAuthStateChanged, getCurrentUser } from "@/firebase/client";

export function useUser(): User | null | undefined {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(() => {
      getCurrentUser().then(setUser);
    });

    return () => unsubscribe();
  }, []);

  return user;
}
