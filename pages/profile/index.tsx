import type { User } from "@/types";

import { useEffect, useState } from "react";

import { getCurrentUser, onAuthStateChanged } from "@/firebase/client";
import { Profile } from "@/components/profile";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1️⃣ Cuando se monta, obtenemos el usuario actual
    getCurrentUser().then(setUser);

    // 2️⃣ Nos suscribimos a cambios de login/logout
    const unsubscribe = onAuthStateChanged(() => {
      getCurrentUser().then(setUser);
    });

    // 3️⃣ Cleanup al desmontar
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <h1 className="text-2xl font-bold">Unauthorized</h1>
          <p className="text-muted-foreground">
            You need to be logged in to view this page.
          </p>
        </div>
      </>
    );
  }

  return <Profile user={user} />;
}
