import type { User } from "@/types";

import { useContext } from "react";

import { UserContext } from "@/context/user";

export function useUser(): User | null | undefined {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context.user;
}
