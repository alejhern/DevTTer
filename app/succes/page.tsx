"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";

import { auth } from "@/firebase/app";

export default function SuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await fetch("/api/auth/token");

        if (!res.ok) {
          throw new Error("No se pudo obtener el token");
        }

        const { token } = await res.json();

        if (!token) {
          throw new Error("Token vacío");
        }

        await signInWithCustomToken(auth, token);

        // 🔥 una vez logueado → redirigir
        router.replace("/profile");
      } catch (err) {
        console.error("Error en success auth:", err);
        router.replace("/home"); // fallback
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-bold">
        {loading ? "Autenticando..." : "Redirigiendo..."}
      </h1>
      <p className="text-gray-500">Estamos iniciando tu sesión con 42 🚀</p>
    </div>
  );
}
