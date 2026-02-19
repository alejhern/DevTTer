import type { User } from "@/types";
import type { NavItem } from "@/config/site";

import { useState, useEffect, useCallback } from "react";

import { onAuthStateChanged } from "@/firebase/client";
import { siteConfig } from "@/config/site";

export function useNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Array<NavItem>>(siteConfig.navItems);
  const [isLoggingOpen, setIsLoggingOpen] = useState<boolean>(false);

  const handlerLogin = useCallback(() => {
    setIsLoggingOpen(true);
  }, []);

  const handlerLogout = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    if (isLoggingOpen) return;
    const unsubscribe = onAuthStateChanged(setUser);

    return () => unsubscribe();
  }, [isLoggingOpen]);

  useEffect(() => {
    if (user) {
      setLinks(() => [
        { href: "/profile", label: "Profile", avatar: user.photoURL },
        ...siteConfig.navItems,
      ]);
    } else {
      setLinks(siteConfig.navItems);
    }
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
