"use client";
import type { User, Devit } from "@/types";

import { useState, useEffect } from "react";

import { useUser } from "@/hooks/useUser";
import { Profile } from "@/components/profile";
import AutorizePage from "@/components/autorizePage";
import { getUserDevits } from "@/firebase/devits";

export default function ProfilePage() {
  const user = useUser();
  const [devits, setDevits] = useState<Devit[] | undefined>(undefined);

  useEffect(() => {
    if (!user) return;

    getUserDevits(user.id).then(setDevits);
  }, [user]);

  return (
    <AutorizePage>
      <Profile devits={devits} user={user as User} />
    </AutorizePage>
  );
}
