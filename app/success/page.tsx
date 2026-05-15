"use client";

import { signInWithCustomToken } from "firebase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { auth } from "@/firebase/app";
import { saveUser } from "@/services/user";

export default function SuccessPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const firebaseToken = Cookies.get("firebase_custom_token");

        if (!firebaseToken) {
          router.replace("/");

          return;
        }

        // login firebase
        await signInWithCustomToken(auth, firebaseToken);

        // eliminar token temporal
        Cookies.remove("firebase_custom_token");

        // asegurar currentUser listo
        await auth.currentUser?.getIdToken();

        // guardar usuario
        await saveUser();

        router.replace("/profile");
      } catch (error) {
        console.error("Error in success auth:", error);

        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    authenticate();
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
