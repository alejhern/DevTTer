import { NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/firebase/admin";

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split(" ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { user } = await req.json();

    if (!user) {
      return NextResponse.json(
        { message: "User body missing" },
        { status: 400 },
      );
    }

    await adminDb
      .collection("users")
      .doc(uid)
      .set(
        {
          ...user,
          lastActive: "active",
        },
        { merge: true },
      );

    return NextResponse.json({
      message: "User updated",
      uid,
    });
  } catch (error) {
    console.error("Error updating user:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
