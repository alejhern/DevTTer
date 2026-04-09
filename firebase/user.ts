import type { User } from "@/types";

import { onAuthStateChanged as firebaseOnAuthStateChanged } from "firebase/auth";

import { auth } from "./app";

export const searchUsers = async (q: string): Promise<User[]> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_FT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(q)}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to search users");
  }

  const data = await res.json();

  return data as User[];
};

export const getUser = async (id: string): Promise<User> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_FT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/users/${id}`, {
    method: "GET",
  });

  if (!res.ok) {
    console.error(`Failed to fetch user with id ${id}:`, res.statusText);
  }
  const data = await res.json();
  const user = data.user as User;

  return user;
};

const getCurrentUser = async (): Promise<User | null> => {
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

    const res = await fetch("/api/users", {
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
