import { apiFetch } from "./api.client";

import { auth } from "@/firebase/app";

/**
 * 🔹 Logout backend + Firebase
 */

export const logout = async (): Promise<void> => {
  try {
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      console.warn("No user token found during logout");

      return;
    }

    await fetch("/api/auth/logout", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await apiFetch("/user/logout", {
      method: "POST",
    });
    await auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
  }
};

/**
 * 🔹 Usuario actual (backend)
 */
export const getMe = async (): Promise<any> => {
  const response = await fetch("/api/auth/42/intra/token", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return response.json();
};
