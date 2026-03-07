import admin from "firebase-admin";
import { NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/firebase/admin";

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const dekodedToken = await adminAuth.verifyIdToken(token);
    const uid = dekodedToken.uid;

    await adminAuth.revokeRefreshTokens(uid);
    await adminDb.collection("users").doc(uid).update({
      lastActive: admin.firestore.FieldValue.serverTimestamp(),
    });
    const response = NextResponse.json({ message: "Logged out" });

    response.cookies.delete("intra_access_token");
    response.cookies.delete("firebase_custom_token");

    return response;
  } catch (error) {
    console.error("Error during logout:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
