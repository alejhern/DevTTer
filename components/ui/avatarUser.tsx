"use client";

import type { User } from "@/types";

import { Avatar } from "@heroui/react";

import { useUserStatus } from "@/context/userStatus";

export function AvatarUser({
  user,
  width,
  height,
}: {
  user: User;
  width?: number;
  height?: number;
}) {
  const online = useUserStatus(user.id);

  return (
    <div className="relative">
      <Avatar name={user.name} src={user.avatar} style={{ width, height }} />

      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
      )}
    </div>
  );
}
