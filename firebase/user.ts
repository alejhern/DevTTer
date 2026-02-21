import type { User } from "@/types";

import {
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from "firebase/auth";

import { auth } from "./app";

export const getCurrentUser = async (): Promise<User | null> => {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) return null;

  // Recuperamos el token guardado
  const token = localStorage.getItem("github_token");

  if (token) {
    // Llamamos a GitHub API
    const response = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${token}` },
    });
    const githubUser = await response.json();

    const user: User = {
      id: firebaseUser.uid,
      userName: githubUser.login,
      name: firebaseUser.displayName || githubUser.name || "GitHub User",
      email: firebaseUser.email || githubUser.email || "",
      avatar: firebaseUser.photoURL || githubUser.avatar_url || "",
    };

    return user;
  }

  // Si no hay token, devolvemos UID temporal
  return {
    id: firebaseUser.uid,
    userName: firebaseUser.uid,
    name: firebaseUser.displayName || "User",
    email: firebaseUser.email || "",
    avatar: firebaseUser.photoURL || "",
  };
};

// LOGIN con GitHub
export const loginWithGithub = async () => {
  const provider = new GithubAuthProvider();
  const result = await signInWithPopup(auth, provider);

  // Aquí sí tenemos el token
  const credential = GithubAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken;

  if (!token) throw new Error("No se pudo obtener token de GitHub");
  localStorage.setItem("github_token", token);

  return await getCurrentUser();
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
    localStorage.removeItem("github_token");
  } catch (error) {
    throw error;
  }
};
