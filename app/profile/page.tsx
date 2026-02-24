"use client";
import type { User } from "@/types";

import { useUser } from "@/hooks/useUser";
import { Profile } from "@/components/profile";
import AutorizePage from "@/components/autorizePage";

export default function ProfilePage() {
  const user = useUser();

  return (
    <AutorizePage user={user}>
      <Profile user={user as User} />
    </AutorizePage>
  );
}
