import type { User } from "@/types";

import { useEffect, useState } from "react";
import { Avatar } from "@heroui/react";

import { onAuthStateChanged } from "@/firebase/client";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(setUser);
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

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Avatar
          alt={user.name || "User Avatar"}
          className="rounded-full w-24 h-24"
          size="lg"
          src={user.photoURL || undefined}
        />
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
    </>
  );
}
