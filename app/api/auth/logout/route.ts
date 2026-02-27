import { NextResponse } from "next/server";

export async function DELETE() {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 },
  );

  // Delete session cookies
  response.cookies.delete("intra_access_token");
  response.cookies.delete("firebase_custom_token");

  return response;
}
