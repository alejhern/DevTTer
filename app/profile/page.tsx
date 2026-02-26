"use client";
import type { User, Devit } from "@/types";

import { useState, useEffect } from "react";

import { useUser } from "@/hooks/useUser";
import { Profile } from "@/components/profile";
import AutorizePage from "@/components/autorizePage";
import { getDevits } from "@/firebase/devits";

async function getUserDevits(userId: string): Promise<Devit[]> {
  try {
    return await getDevits(`users/${userId}`);
  } catch (error: any) {
    console.error("Error fetching user devits:", error);

    return [];
  }
}

export default function ProfilePage() {
  const user = useUser();
  const [devits, setDevits] = useState<Devit[]>([]);

  useEffect(() => {
    if (!user) return;

    getUserDevits(user.id).then(setDevits);
  }, [user]);

  return (
    <AutorizePage user={user}>
      <Profile devits={devits} user={user as User} />
    </AutorizePage>
  );
}
