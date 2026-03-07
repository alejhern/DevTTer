import { NextResponse } from "next/server";

import { adminDb } from "@/firebase/admin";
import { getDevitWithNComments } from "@/lib/utils";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ idUser: string }> },
) {
  try {
    const { idUser } = await params;
    const devitsSnapshot = await adminDb
      .collection("devits")
      .where("author", "==", idUser)
      .orderBy("createdAt", "desc")
      .get();

    const devits = await getDevitWithNComments(devitsSnapshot);

    return NextResponse.json(devits, { status: 200 });
  } catch (error: any) {
    console.error("API ERROR:", error);

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
