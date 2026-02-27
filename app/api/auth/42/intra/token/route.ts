import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("intra_access_token")?.value;

  if (!accessToken) {
    return new Response("No autorizado", { status: 401 });
  }

  const res = await fetch("https://api.intra.42.fr/v2/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  return Response.json(data);
}
