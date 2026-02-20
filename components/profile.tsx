import type { User } from "@/types";

import { Avatar } from "@heroui/react";

export function Profile({ user }: { user: User }) {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Avatar
          alt={user.name || "User Avatar"}
          className="rounded-full w-24 h-24"
          size="lg"
          src={user.photoURL || undefined}
        />
        <h1 className="text-4xl font-semibold">@{user.userName}</h1>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
    </>
  );
}
