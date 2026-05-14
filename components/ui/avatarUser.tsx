"use client";

import type { User } from "@/types";

import { Avatar } from "@heroui/react";
import { useEffect, useState } from "react";

import { useSocket } from "@/context/socket";

export function AvatarUser({
  user,
  width,
  height,
}: {
  user: User;
  width?: number;
  height?: number;
}) {
  const { socket, isConnected } = useSocket();

  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // estado inicial
    socket.emit("user:get_status", user.id, (isOnline: boolean) => {
      setOnline(isOnline);
    });

    // realtime updates
    const handleStatusChanged = ({
      userId,
      online,
    }: {
      userId: string;
      online: boolean;
    }) => {
      if (userId === user.id) {
        setOnline(online);
      }
    };

    socket.on("user_status_changed", handleStatusChanged);

    return () => {
      socket.off("user_status_changed", handleStatusChanged);
    };
  }, [socket, isConnected, user.id]);

  return (
    <div className="relative">
      <Avatar name={user.name} src={user.avatar} style={{ width, height }} />

      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
      )}
    </div>
  );
}
