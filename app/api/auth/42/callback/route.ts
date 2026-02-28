import { NextRequest, NextResponse } from "next/server";

import { adminAuth } from "@/firebase/admin";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ message: "Code is required" }, { status: 400 });
  }

  // 1️⃣ Intercambiar code por access_token (FORM URL ENCODED)
  const tokenRes = await fetch("https://api.intra.42.fr/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.FT_CLIENT_ID!,
      client_secret: process.env.FT_CLIENT_SECRET!,
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_FT_PUBLIC_APP_URL}${process.env.FT_REDIRECT_URI}`,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    console.error("Error obteniendo access token:", tokenData);

    return NextResponse.json(
      { error: "No se pudo obtener access token de 42" },
      { status: 500 },
    );
  }

  // 2️⃣ Obtener usuario de 42
  const userRes = await fetch("https://api.intra.42.fr/v2/me", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  const user42 = await userRes.json();

  if (!user42?.id) {
    return NextResponse.json(
      { error: "No se pudo obtener usuario de 42" },
      { status: 500 },
    );
  }

  // 3️⃣ Crear custom token Firebase
  const firebaseToken = await adminAuth.createCustomToken(
    user42.id.toString(),
    {
      username: user42.login,
      email: user42.email,
    },
  );
  const baseUrl = process.env.NEXT_PUBLIC_FT_PUBLIC_APP_URL;
  const response = NextResponse.redirect(`${baseUrl}/success`);

  // 🔐 Cookie Firebase
  response.cookies.set({
    name: "firebase_custom_token",
    value: firebaseToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  // 🔐 Cookie Intra 42 access token
  response.cookies.set({
    name: "intra_access_token",
    value: tokenData.access_token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: tokenData.expires_in || 60 * 60, // usar expires_in si está disponible
  });

  return response;
}
