import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("intra_access_token")?.value;

    if (!accessToken) {
      return new Response("No autorizado", { status: 401 });
    }

    const res = await fetch("https://api.intra.42.fr/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const text = await res.text();

      console.error("Error Intra API:", res.status, text);

      return new Response("Error al obtener usuario de Intra", {
        status: res.status,
      });
    }

    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    console.error("Error interno en /api/auth/42/intra/token:", error);

    return new Response("Error interno", { status: 500 });
  }
}
