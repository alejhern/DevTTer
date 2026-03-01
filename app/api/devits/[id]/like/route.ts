import { NextResponse } from "next/server";

import { adminDb, adminAuth } from "@/firebase/admin";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    const docRef = adminDb.collection("devits").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ message: "Devit not found" }, { status: 404 });
    }

    const devit = docSnap.data();

    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const likes = devit?.likes || [];
    const hasLiked = likes.includes(userId);

    const updatedLikes = hasLiked
      ? likes.filter((uid: string) => uid !== userId)
      : [...likes, userId];

    await docRef.update({ likes: updatedLikes });

    return NextResponse.json({
      message: hasLiked ? "Devit unliked" : "Devit liked",
    });
  } catch (error) {
    console.error("Error liking devit:", error);

    return NextResponse.json(
      { message: "Failed to like devit" },
      { status: 500 },
    );
  }
}
