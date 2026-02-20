import { useState, useCallback } from "react";

import { logout } from "@/firebase/client";

export function useNavbar() {
  const [isLoggingOpen, setIsLoggingOpen] = useState<boolean>(false);

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

  return {
    handlerLogin,
    handlerLogout,
    isLoggingOpen,
    closeLogin,
  };
}
