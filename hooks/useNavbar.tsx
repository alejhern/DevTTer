import type { User } from "@/types";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

import { onAuthStateChanged, logout, getCurrentUser } from "@/firebase/client";
import { siteConfig } from "@/config/site";

export function useNavbar() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const links = siteConfig.navItems;
  const [isLoggingOpen, setIsLoggingOpen] = useState<boolean>(false);
  const router = useRouter();

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
    const unsubscribe = onAuthStateChanged(() => {
      getCurrentUser().then(setUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) router.replace("/profile");
  }, [user]);

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
