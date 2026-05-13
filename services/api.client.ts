import { auth } from "@/firebase/app";

const API_URL =
  process.env.NEXT_PUBLIC_DEVTER_API_URL || "http://localhost:3001";

/**
 * 🔹 Obtiene Firebase token actual
 */
const getToken = async (): Promise<string | null> => {
  const user = auth.currentUser;

  if (!user) return null;

  return await user.getIdToken();
};

/**
 * 🔹 Fetch centralizado con auth automática
 */
export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = await getToken();

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    return res.json();
  } catch (error) {
    console.error("Network or parsing error:", error);

    return null as unknown as T; // Devuelve null en caso de error, pero se puede ajustar según necesidades
  }
};
