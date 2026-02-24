import { NextResponse } from "next/server";

import { adminDb } from "@/firebase/admin";

export async function GET() {
  try {
    const devitsSnapshot = await adminDb
      .collection("devits")
      .orderBy("createdAt", "desc")
      .get();

    const devits = devitsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.(),
    }));

    return NextResponse.json(devits, { status: 200 });
  } catch (error: any) {
    console.error("API ERROR:", error);

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
