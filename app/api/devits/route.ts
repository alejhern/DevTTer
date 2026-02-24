import { NextResponse } from "next/server";

import { adminDb } from "@/firebase/admin";

export async function GET() {
  try {
    const devitsSnapshot = await adminDb
      .collection("devits")
      .orderBy("createdAt", "desc")
      .get();

    const devits = devitsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(devits, { status: 200 });
  } catch (error: any) {
    console.error("API ERROR:", error);

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
