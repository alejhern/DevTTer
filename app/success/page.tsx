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
    const firebaseToken = Cookies.get("firebase_custom_token");

    if (!firebaseToken) {
      router.replace("/home");

      return;
    }

    (async () => {
      try {
        await signInWithCustomToken(auth, firebaseToken);
        await saveUser();
        router.replace("/profile");
      } catch (err) {
        console.error("Error in success auth:", err);
        router.replace("/home");
      } finally {
        setLoading(false);
      }
    })();
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
