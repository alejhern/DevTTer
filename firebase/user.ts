import type { User } from "@/types";

import { onAuthStateChanged as firebaseOnAuthStateChanged } from "firebase/auth";

import { auth } from "./app";

import { getMe } from "@/services/auth";
import { UKNOWN_USER } from "@/types";

const getCurrentUser = async (): Promise<User | null> => {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) return null;
  try {
    const intraUser = await getMe();

    return {
      id: firebaseUser.uid,
      userName: intraUser.login,
      name:
        firebaseUser.displayName ||
        `${intraUser.first_name} ${intraUser.last_name}`,
      email: firebaseUser.email || intraUser.email,
      avatar: firebaseUser.photoURL || intraUser.image?.link,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);

    return {
      id: firebaseUser.uid,
      userName: firebaseUser.displayName || UKNOWN_USER.userName,
      name: firebaseUser.displayName || UKNOWN_USER.name,
      email: firebaseUser.email || UKNOWN_USER.email,
      avatar: firebaseUser.photoURL || UKNOWN_USER.avatar,
    };
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
