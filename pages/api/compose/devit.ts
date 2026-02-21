import type { Devit, User } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

import { FieldValue } from "firebase-admin/firestore";

import { adminDb, adminAuth } from "@/firebase/admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const devit = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });

    const idToken = authHeader.split(" ")[1];

    // Verificar el token de Firebase
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // decodedToken.uid y decodedToken.email están disponibles
    const currentUser: User = {
      id: decodedToken.uid,
      userName: decodedToken.uid,
      email: decodedToken.email || "",
      name: decodedToken.name || "Anonymous",
      avatar:
        decodedToken.picture || "https://www.gravatar.com/avatar?d=mp&s=200", // Avatar por defecto
    };

    const devitData: Devit = {
      ...devit,
      author: currentUser,
      createdAt: FieldValue.serverTimestamp(), // Firestore timestamp
    };

    const docRef = adminDb.collection("devits").add(devitData);

    return res
      .status(201)
      .json({ message: "Devit created", id: (await docRef).id });
  } catch (error: any) {
    console.error("API ERROR:", error);

    return res.status(500).json({ message: error.message });
  }
}
