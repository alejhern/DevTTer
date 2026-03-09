import { NextResponse } from "next/server";

import { adminDb } from "@/firebase/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 },
    );
  }

  try {
    const usersRef = adminDb.collection("users");

    const querySnapshot = await usersRef
      .where("userName", ">=", q)
      .where("userName", "<=", q + "\uf8ff")
      .get();

    const users = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error searching users:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
