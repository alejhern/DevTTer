// pages/api/compose/devit.ts
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
    const currentUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name || "Anonymous",
      photoURL: decodedToken.picture || null,
    };

    const devitData = {
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
