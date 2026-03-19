import type { Devit, User } from "@/types";

import Image from "next/image";

import DevitActions from "./devitActions";
import { DevitsDisplayer } from "./devitsDisplayer";
import { Post } from "./post";
import { Loading } from "./ui/loading";

export function Profile({
  user,
  devits,
}: {
  user: User;
  devits: Devit[] | undefined;
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="relative w-36 h-36 rounded-full overflow-hidden shadow-2xl border-2 border-blue-400">
          <Image
            priority
            alt={user.name || "User Avatar"}
            className="object-cover w-full h-full"
            height={140}
            src={user.avatar}
            width={140}
          />
        </div>
        <h1 className="text-4xl font-semibold">@{user.userName}</h1>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold mb-6">My Devits</h2>
        <div className="flex flex-col gap-10">
          {devits === undefined ? (
            <Loading />
          ) : (
            <DevitsDisplayer
              devitsWithAuthors={devits.map((devit) => ({
                devit,
                author: user,
              }))}
              user={user}
            >
              {devits.length === 0 ? (
                <p className="text-base text-zinc-400 text-center py-24">
                  No devits yet.
                </p>
              ) : (
                devits.map((devit) => (
                  <Post key={devit.id} post={{ devit, author: user }}>
                    <DevitActions devit={devit} />
                  </Post>
                ))
              )}
            </DevitsDisplayer>
          )}
        </div>
      </div>
    </>
  );
}
