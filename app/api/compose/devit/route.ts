import type { Devit, User } from "@/types";

import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { adminDb, adminAuth } from "@/firebase/admin";

export async function POST(req: Request) {
  try {
    const devit = await req.json(); // body en App Router
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split(" ")[1];

    // Verificar el token de Firebase
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const currentUser: User = {
      id: decodedToken.uid,
      userName: decodedToken.uid,
      email: decodedToken.email || "",
      name: decodedToken.name || "Anonymous",
      avatar:
        decodedToken.picture || "https://www.gravatar.com/avatar?d=mp&s=200",
    };

    const devitData: Devit = {
      ...devit,
      author: currentUser,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection("devits").add(devitData);

    return NextResponse.json(
      { message: "Devit created", id: docRef.id },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("API ERROR:", error);

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
