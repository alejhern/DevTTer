import { NextResponse } from "next/server";

import { adminDb } from "@/firebase/admin";

export async function GET(req: Request) {
  try {
    // Extraemos el id directamente de la URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // obtiene el último segmento

    if (!id) {
      return NextResponse.json({ message: "Missing id" }, { status: 400 });
    }

    const userDoc = await adminDb.collection("users").doc(id).get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error("Error fetching user:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
