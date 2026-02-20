import type { User } from "../types/index";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCPNG8D9e6f6NUcY6xQVpUSQoU_d7iZTsE",
  authDomain: "devtter-c169a.firebaseapp.com",
  projectId: "devtter-c169a",
  storageBucket: "devtter-c169a.firebasestorage.app",
  messagingSenderId: "377164209549",
  appId: "1:377164209549:web:fed53a9d16e3e3de0871c4",
  measurementId: "G-SC0J347VHM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// LOGIN con GitHub
export const loginWithGithub = async () => {
  const provider = new GithubAuthProvider();
  const result = await signInWithPopup(auth, provider);

  // Aquí sí tenemos el token
  const credential = GithubAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken;

  if (!token) throw new Error("No se pudo obtener token de GitHub");
  sessionStorage.setItem("github_token", token);
};

const getCurrentUser = async (): Promise<User | null> => {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) return null;

  // Recuperamos el token guardado
  const token = sessionStorage.getItem("github_token");

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

// ON AUTH STATE CHANGED
export const onAuthStateChanged = (callback: (_user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, () => {
    return getCurrentUser().then(callback);
  });
};

// LOGOUT
export const logout = async (): Promise<void> => {
  await auth.signOut();
};
