import { NextResponse } from "next/server";

import { adminDb } from "@/firebase/admin";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const devitDoc = await adminDb.collection("devits").doc(id).get();

    if (!devitDoc.exists) {
      return NextResponse.json({ message: "Devit not found" }, { status: 404 });
    }

    const devitData = {
      ...devitDoc.data(),
      id: devitDoc.id,
      createdAt: devitDoc.data()?.createdAt?.toDate?.(),
    };

    return NextResponse.json(devitData, { status: 200 });
  } catch (error: any) {
    console.error("API ERROR:", error);

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
