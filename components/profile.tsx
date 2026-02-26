import type { User, Devit } from "@/types";

import { Avatar } from "@heroui/react";

import { Post } from "./post";

export function Profile({ user, devits }: { user: User; devits: Devit[] }) {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Avatar
          alt={user.name || "User Avatar"}
          className="rounded-full w-24 h-24"
          size="lg"
          src={user.avatar || undefined}
        />
        <h1 className="text-4xl font-semibold">@{user.userName}</h1>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold mb-6">My Devits</h2>
        {devits.length === 0 ? (
          <p className="text-center text-zinc-500">No devits yet.</p>
        ) : (
          <div className="flex flex-col space-y-6">
            {devits.length === 0 ? (
              <p className="text-base text-zinc-400 text-center py-24">
                No devits yet.
              </p>
            ) : (
              devits.map((devit) => <Post key={devit.id} post={devit} />)
            )}
          </div>
        )}
      </div>
    </>
  );
}
