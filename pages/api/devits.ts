import type { NextApiRequest, NextApiResponse } from "next";

import { adminDb } from "@/firebase/admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const devitsSnapshot = await adminDb
      .collection("devits")
      .orderBy("createdAt", "desc")
      .get();

    const devits = devitsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(devits);
  } catch (error: any) {
    console.error("API ERROR:", error);

    return res.status(500).json({ message: error.message });
  }
}
