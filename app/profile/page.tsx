"use client";
import type { Devit, User } from "@/types";

import { useEffect, useState } from "react";

import AutorizePage from "@/components/autorizePage";
import { Profile } from "@/components/profile";
import { getUserDevits } from "@/firebase/devits";
import { useUser } from "@/hooks/useUser";

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
