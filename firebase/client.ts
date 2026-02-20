import type { User } from "../types/index";

import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const mapFirebaseUserToUser = (firebaseUser: any): User | null => {
  if (!firebaseUser) return null;

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || "GitHub User",
    email: firebaseUser.email || "",
    photoURL: firebaseUser.photoURL || "",
  };
};

export const onAuthStateChanged = (callback: (_user: User | null) => void) => {
  return auth.onAuthStateChanged((firebaseUser) => {
    callback(mapFirebaseUserToUser(firebaseUser));
  });
};

export const getCurrentUser = (): User => {
  const firebaseUser = auth.currentUser;

  return mapFirebaseUserToUser(firebaseUser) as User;
};

export const loginWithGithub = async (): Promise<User> => {
  try {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // This gives you a GitHub Access Texportoken. You can use it to access the GitHub API.
    //const credential = GithubAuthProvider.credentialFromResult(result);
    //const token = credential?.accessToken;
    // The signed-in user info.
    const userGithub = result.user;

    return mapFirebaseUserToUser(userGithub) as User;
  } catch (error) {
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error) {
    throw error;
  }
};
