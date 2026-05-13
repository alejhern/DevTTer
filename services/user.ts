import type { User } from "@/types";

import { apiFetch } from "./api.client";
import { getMe } from "./auth";

/**
 * 🔹 Buscar usuarios
 */
export const searchUsers = async (q: string): Promise<User[]> => {
  try {
    const data = await apiFetch<User[]>(
      `/users/search?q=${encodeURIComponent(q)}`,
    );

    return data;
  } catch (error) {
    console.error("Error searching users:", error);

    return [];
  }
};

/**
 * 🔹 Obtener usuario por ID
 */
export const getUser = async (id: string): Promise<User | null> => {
  try {
    const data = await apiFetch<{ user: User }>(`/users/${id}`);

    if (!data || !data.user) {
      return null;
    }

    return data.user;
  } catch (error) {
    console.error("Error fetching user:", error);

    return null;
  }
};

/**
 * 🔹 Crear o actualizar usuario
 */
export const saveUser = async (): Promise<void> => {
  try {
    const user42 = await getMe(); // obtiene datos del usuario actual desde el backend

    if (!user42) {
      throw new Error("No user data available to save");
    }

    const user: Omit<User, "id"> = {
      userName: user42.login,
      name: user42.displayname,
      email: user42.email,
      avatar: user42.image?.link || "",
    };

    await apiFetch("/users", {
      method: "PUT",
      body: JSON.stringify(user),
    });
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

/**
 * 🔹 Batch users
 */
export const getUsersByIds = async (ids: string[]): Promise<User[]> => {
  try {
    const data = await apiFetch<User[]>("/users/batch", {
      method: "POST",
      body: JSON.stringify({ ids }),
    });

    return data;
  } catch (error) {
    console.error("Error fetching users by ids:", error);

    return [];
  }
};
