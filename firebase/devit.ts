import type { Devit } from "@/types";

import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

import { db, auth } from "./app";

export const createDevit = async (devit: Devit) => {
  const user = auth.currentUser;

  try {
    if (!user) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, "devits"), devit);

    return docRef.id;
  } catch (error) {
    console.error("Error creating devit:", error);
    throw error;
  }
};

export const getDevits = async (): Promise<Devit[]> => {
  try {
    const q = query(collection(db, "devits"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Devit);
  } catch (error) {
    console.error("Error fetching devits:", error);
    throw error;
  }
};
