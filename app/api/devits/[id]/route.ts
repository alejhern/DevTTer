import { NextResponse } from "next/server";

import { adminDb } from "@/firebase/admin";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  try {
    const devitDoc = await adminDb.collection("devits").doc(id).get();
    const commentsSnapshot = await devitDoc.ref
      .collection("comments")
      .orderBy("createdAt", "desc")
      .get();
    const comments = commentsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.(),
    }));

    if (!devitDoc.exists) {
      return NextResponse.json({ message: "Devit not found" }, { status: 404 });
    }

    const devitData = {
      ...devitDoc.data(),
      id: devitDoc.id,
      createdAt: devitDoc.data()?.createdAt?.toDate?.(),
      comments: comments,
    };

    return NextResponse.json(devitData, { status: 200 });
  } catch (error: any) {
    console.error("API ERROR:", error);

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
