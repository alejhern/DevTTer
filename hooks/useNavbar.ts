import { useState, useCallback, useRef } from "react";

import { logout } from "@/firebase/user";

export function useNavbar() {
  const [isLoggingOpen, setIsLoggingOpen] = useState<boolean>(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  const handlerLogin = useCallback(() => {
    setIsLoggingOpen(true);
  }, []);

  const handlerLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, []);

  const closeLogin = useCallback(() => {
    setIsLoggingOpen(false);
  }, []);

  const handleClickOutside = useCallback(() => {
    if (menuToggleRef.current) {
      menuToggleRef.current.click();
    }
  }, []);

  return {
    handlerLogin,
    handlerLogout,
    isLoggingOpen,
    closeLogin,
    menuToggleRef,
    handleClickOutside,
  };
}
