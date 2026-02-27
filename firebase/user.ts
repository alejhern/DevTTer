import type { User } from "@/types";

import { onAuthStateChanged as firebaseOnAuthStateChanged } from "firebase/auth";

import { auth } from "./app";

export const getCurrentUser = async (): Promise<User | null> => {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) return null;
  const res = await fetch("/api/auth/42/intra/token"); // devuelve datos de usuario desde token en cookie

  if (res.ok) {
    const intraUser = await res.json();

    return {
      id: firebaseUser.uid,
      userName: intraUser.login,
      name:
        firebaseUser.displayName ||
        `${intraUser.first_name} ${intraUser.last_name}`,
      email: firebaseUser.email || intraUser.email,
      avatar: firebaseUser.photoURL || intraUser.image?.link,
    };
  }

  return null;
};

// ON AUTH STATE CHANGED
export const onAuthStateChanged = (callback: (_user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      return callback(null);
    }

    try {
      const user = await getCurrentUser();

      callback(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      callback(null);
    }
  });
};

// LOGOUT
export const logout = async (): Promise<void> => {
  try {
    await auth.signOut();
    await fetch("/api/auth/logout", { method: "DELETE" }); // elimina cookie de token
    // localStorage.removeItem("github_token");
  } catch (error) {
    throw error;
  }
};
