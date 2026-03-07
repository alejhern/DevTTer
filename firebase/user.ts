import type { User } from "@/types";

import { onAuthStateChanged as firebaseOnAuthStateChanged } from "firebase/auth";

import { auth } from "./app";

export const getCurrentUser = async (): Promise<User | null> => {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) return null;
  const res = await fetch("/api/auth/42/intra/token", {
    method: "GET",
    credentials: "include",
  }); // devuelve datos de usuario desde token en cookie

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

export const saveUser = async (): Promise<void> => {
  try {
    const token = await auth.currentUser?.getIdToken();
    const user = await getCurrentUser();

    if (!token || !user) {
      throw new Error("User is not authenticated");
    }

    const res = await fetch("/api/user", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ user }),
    });

    if (!res.ok) {
      throw new Error("Failed to save user data");
    }
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
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
