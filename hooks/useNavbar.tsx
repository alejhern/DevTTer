import type { User } from "@/types";

import { useState, useEffect, useCallback } from "react";

import { onAuthStateChanged, logout, getCurrentUser } from "@/firebase/client";
import { siteConfig } from "@/config/site";

export function useNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const links = siteConfig.navItems;
  const [isLoggingOpen, setIsLoggingOpen] = useState<boolean>(false);

  const handlerLogin = useCallback(() => {
    setIsLoggingOpen(true);
  }, []);

  const handlerLogout = useCallback(async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, []);

  useEffect(() => {
    if (isLoggingOpen) return;
    const unsubscribe = onAuthStateChanged(() => {
      getCurrentUser().then(setUser);
    });

    return () => unsubscribe();
  }, [isLoggingOpen]);

  const closeLogin = useCallback(() => {
    setIsLoggingOpen(false);
  }, []);

  return {
    user,
    links,
    handlerLogin,
    handlerLogout,
    isLoggingOpen,
    closeLogin,
  };
}
